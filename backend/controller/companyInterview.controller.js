import dotenv from 'dotenv'
dotenv.config();

import CompanyInterviewData from "../models/companyInterview.model.js";
import User from '../models/user.model.js'
import axios from 'axios'
import { validateRoleAndTopic } from '../utils/validateRoleAndTopic.js'
import { generateQuestions } from '../utils/generateQuestions.js'
import InterviewData from "../models/interview.model.js";
import { evaluateResult } from "../utils/evaluateResult.js";
import Internship from "../models/internships.model.js";
import { getTransporter } from '../config/nodemailer.config.js';
import { sendTemplateMessage, sendTextMessage } from '../utils/sendWhatsappMessage.js'


const transporter = getTransporter();
const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

export const createCompanyInterview = async (req, res) => {
  const userId = req.user._id;
  const {
    jobTitle,
    jobRole,
    jobTopic,
    duration,
    type,
    company,
    stipend,
    jobType,
    lastDate,
    description,
    numOfQns,
    location
  } = req.body;

  const requiredFields = {
    jobTitle,
    jobRole,
    jobTopic,
    duration,
    type,
    company,
    stipend,
    jobType,
    lastDate,
    description,
    numOfQns,
    location
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
    .map(([key]) => key);

  if (!userId || missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const role = jobRole;
    const topics = jobTopic.split(",").map(t => t.trim());

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${GEOAPIFY_KEY}`;

    const geoResponse = await axios.get(url);
    const locationData = geoResponse.data;
    let lat;
    let lon;

    if (locationData.features && locationData.features.length > 0) {
      const propertiesObject = locationData.features[0].properties;
      lat = propertiesObject.lat;
      lon = propertiesObject.lon;
    } else {
      console.log("No coordinates found for", location);
      return res.status(500).json({ message: "No coordinates found for!" }); 
    }

    const { valid } = await validateRoleAndTopic({ role, topics });

    if (!valid) {
      return res.status(500).json({ message: "Role and Topic are not valid!" });
    }

    const { data } = await axios.post("http://127.0.0.1:5001/embed", requiredFields);
    if (!data) {
      return res.status(500).json({ message: "Server error!" });
    }

    const newData = new Internship({
      jobTitle,
      jobRole,
      jobTopic,
      duration,
      type,
      company,
      stipend,
      jobType,
      lastDate,
      description,
      numOfQns,
      embedding: data.embedding,
      locationName: location,
      location: {
        type: 'Point',
        coordinates: [lon, lat]
      },
    });
    await newData.save();

    const eligibleUsers = await axios.post("http://127.0.0.1:5001/eligible_users", {
      internshipId: newData._id,
    });

    const eligible_users = eligibleUsers.data.eligible_users || [];

    const userIds = eligible_users.map(u => u.userId);

    const users = await User.find(
      { _id: { $in: userIds } },
      { name: 1, email: 1, mobileNumber: 1 }
    );

    console.log(users);


    for (const user of users) {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `Exciting Internship Opportunity: ${jobTitle} at ${company}`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2 style="color: #2c3e50;">Hello ${user.name},</h2>
          <p>We’re excited to share a new <strong>internship opportunity</strong> that perfectly matches your profile!</p>
          
          <div style="padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fefefe; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h3 style="color: #ff6900; margin-bottom: 10px;">${jobTitle}</h3>
            <p><strong>Role:</strong> ${jobRole}</p>
            <p><strong>Duration:</strong> ${duration}</p>
            <p><strong>Company:</strong> <span style="color: #2980b9; font-weight: bold;">${company}</span></p>
            <p><strong>Stipend:</strong> ${stipend}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>
          
          <p style="margin-top: 20px;">
            🌟 Don’t miss this chance to grow your skills and advance your career.  
            Click below to apply now:
          </p>
          
          <a href="https://prepverse-ai.onrender.com/" 
            style="display: inline-block; margin-top: 10px; padding: 12px 25px; background-color: #ff6900; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Apply Now
          </a>

          <p style="margin-top: 30px; font-size: 13px; color: #888;">
            Best regards,<br/>
            <b>The Prepverse.AI Team</b><br/>
            <a href="https://prepverse-ai.onrender.com/" style="color:#2980b9;">https://prepverse-ai.onrender.com</a> | support@prepverse.com
          </p>
        </div>
        `,
      };


      await transporter.sendMail(mailOptions);

      if (user.mobileNumber) {
        await sendTextMessage({
          to: user.mobileNumber,
          name: user.name,
          jobTitle,
          jobRole,
          duration,
          company,
          stipend,
        });
      }
    }

    return res.status(200).json({
      message: "Interview Data Created & Emails Sent",
      newData,
      notifiedUsers: users.map(u => u.email),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const sendAllInterviews = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {
    const internships = await Internship.aggregate([
      { $sample: { size: 5 } },
      { $project: { embedding: 0 } }
    ]);

    return res.status(200).json({ message: 'Interview Data Fetched', internships });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const searchInterviews = async (req, res) => {
  const { companyName } = req.body;

  try {
    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    const internships = await Internship.find(
      { company: { $regex: "^" + companyName, $options: "i" } },
      { embedding: 0 }
    ).limit(5);

    return res.status(200).json({ interviews: internships });


  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const generateInterviewQuestions = async (req, res) => {
  const { role, numOfQns, topic, interviewId } = req.body;

  const participant = req.user._id;

  if (!interviewId || !role || !numOfQns || !topic) {
    return res.status(400).json({ message: 'Please provide valid data' });
  }

  try {

    const existing = await InterviewData.findOne({ interviewId, participant });
    if (existing) {
      return res.status(409).json({
        message: 'Already attended the Interview!'
      });
    }

    const questions = await generateQuestions({ role, topic, numOfQns });

    const interviewData = new InterviewData({
      interviewId,
      participant,
      questions,
      answers: questions.map(() => "Answer Not Provided.")
    });

    await interviewData.save();

    return res.status(200).json({ interviewData });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const evaluateInterviewResult = async (req, res) => {

  const { interivewId } = req.body;

  if (!interivewId) {
    return res.status(501).json({ message: "Missing interviewId" });
  }

  try {

    const interviewData = await InterviewData.findById(interivewId).populate("participant", "name email username profilePicURL").populate("interviewId");

    const { questions, answers } = interviewData;

    const result = await evaluateResult({ questions, answers });

    const { reviews, totalScore, overAllReview } = result;

    interviewData.reviews = reviews;
    interviewData.totalScore = totalScore;
    interviewData.overAllReview = overAllReview;

    await interviewData.save();

    res.status(200).json({ message: "Interview data saved!", interviewData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export const getAllCandidates = async (req, res) => {

  const { interviewId } = req.body;

  if (!interviewId) {
    return res.status(501).json({ message: "Missing interviewId" });
  }

  try {

    const candidates = await InterviewData.find({ interviewId }).populate("participant", "name email username profilePicURL").populate("interviewId");

    return res.status(200).json({ candidates });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

















