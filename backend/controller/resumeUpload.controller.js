import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { deleteFile } from "../utils/deleteFile.js";
import ResumeData from "../models/resumeData.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const userId = req.user._id;
  const filePath = req.file.path;

  try {
    const flaskForm = new FormData();
    flaskForm.append("file", fs.createReadStream(filePath), req.file.originalname);

    const flaskUrl = "http://127.0.0.1:3000/parse-resume";
    const { data } = await axios.post(flaskUrl, flaskForm, {
      headers: flaskForm.getHeaders(),
    });

    if (!data.resume_data) {
      console.error("uploadResume: flask /parse-resume returned no resume_data");
      deleteFile(filePath);
      return res.status(400).json({ message: "Parsing Resume Failed! (no data)" });
    }

    let resume_data;
    try {
      resume_data = JSON.parse(data.resume_data);
    } catch (parseErr) {
      console.error("uploadResume: Failed to JSON.parse resume_data. Raw string was:", data.resume_data.substring(0, 200) + "...");
      console.error(parseErr.message);
      deleteFile(filePath);
      return res.status(400).json({ message: "Parsing Resume Failed! Invalid JSON format from AI." });
    }

    const resumeReview_data = await axios.post(
      "http://127.0.0.1:3000/summarize",
      {resume_data},
    );

    if(!resumeReview_data.data){
      console.error("uploadResume: flask /summarize returned no data");
      deleteFile(filePath);
      return res.status(400).json({ message: "Parsing Resume Failed! (no summary)" });
    }

    const resumeReview = resumeReview_data.data.summary;


    const resume_embedding = await axios.post(
      "http://127.0.0.1:5001/embed_candidate",
      { summary: resumeReview, resumeJSONdata: resume_data },
    );

    if(!resume_embedding.data.embedding){
      return res.status(501).json({message: "resume embedding failed"});
    }

    const embedding = resume_embedding.data.embedding;

    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      upload_preset: "ml_default",
      access_mode: "public",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    const cloudForm = new FormData();
    cloudForm.append("file", fs.createReadStream(filePath));
    cloudForm.append("api_key", process.env.CLOUDINARY_API_KEY);
    cloudForm.append("timestamp", timestamp);
    cloudForm.append("access_mode", "public");
    cloudForm.append("upload_preset", "ml_default");
    cloudForm.append("signature", signature);
    cloudForm.append("resource_type", "auto"); 


    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`;

    const cloudinaryRes = await axios.post(cloudinaryUrl, cloudForm, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const newResume = await ResumeData.findOneAndUpdate(
      { userId },
      {
        resumeLink: cloudinaryRes.data.secure_url,
        resumeJSONdata: resume_data,
        resumeReview: resumeReview,
        embedding: embedding
      },
      { new: true, upsert: true }
    ).select("-embedding");

    deleteFile(filePath);

    return res.status(200).json({
      message: "Resume Uploaded Successfully",
      newResume,
    });

  } catch (err) {
    const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
    console.error("Error in uploadResume:", errorMessage);
    deleteFile(filePath);
    return res.status(err.response?.status || 500).json({ 
      message: "Resume Upload Failed", 
      error: errorMessage 
    });
  }
};



export const deleteResume = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Find the resume belonging to the authenticated user.
    const resume = await ResumeData.findOne({ userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Extract the Cloudinary public ID from the stored resume URL.
    const resumeUrl = resume.resumeLink;
    const urlParts = resumeUrl.split('/');
    const uploadIndex = urlParts.findIndex(
      (part) => part === 'upload'
    );

    if (uploadIndex !== -1) {
      let publicIdParts = urlParts.slice(uploadIndex + 1);

      // Remove Cloudinary transformation/version segments.
      publicIdParts = publicIdParts.filter(
        (part) => !/^v\d+$/.test(part)
      );

      const lastPart = publicIdParts[publicIdParts.length - 1];

      if (lastPart) {
        // Remove the file extension from the public ID.
        publicIdParts[publicIdParts.length - 1] =
          lastPart.replace(/\.[^/.]+$/, '');
      }

      const publicId = publicIdParts.join('/');

      if (publicId) {
        const resourceType = resumeUrl.includes('/raw/upload/')
          ? 'raw'
          : resumeUrl.includes('/image/upload/')
            ? 'image'
            : 'auto';

        try {
          const result = await cloudinary.uploader.destroy(
            publicId,
            { resource_type: resourceType }
          );

          if (
            result.result !== 'ok' &&
            result.result !== 'not found'
          ) {
            console.error('Cloudinary deletion result:', result);
            return res.status(502).json({
              success: false,
              message: 'Cloudinary file could not be deleted'
            });
          }
        } catch (cloudinaryError) {
          console.error(
            'Cloudinary deletion failed:',
            cloudinaryError.message
          );

          return res.status(502).json({
            success: false,
            message: 'Could not delete resume from Cloudinary'
          });
        }
      }
    }

    // Delete the database record after Cloudinary cleanup succeeds.
    await ResumeData.deleteOne({ _id: resume._id });

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Delete resume error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
};



export const getResumeData = async (req, res) => {

  const userId = req.user._id;

  try{

    const resume_data = await ResumeData.findOne({userId : userId});

    // const resumeString = JSON.stringify(resume_data.resumeJSONdata, null, 2);
    // console.log(resumeString);

    return res.status(200).json({resume_data, message: "Resume data fetched successfully!"});

  }catch(err){
    console.log(err);
  }
}


































