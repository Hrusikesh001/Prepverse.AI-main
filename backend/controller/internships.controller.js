
import Internship from "../models/internships.model.js";
import ResumeData from "../models/resumeData.model.js";
import axios from "axios";

export const getMatchedInternships = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { filters = {} } = req.body || {};

    // 1. Validate authenticated user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
        recommend_internships: [],
      });
    }

    console.log("[Recommendations] User ID:", String(userId));

    // 2. Retrieve the logged-in user's resume
    const resumeData = await ResumeData.findOne({ userId }).lean();

    if (!resumeData) {
      console.warn(
        "[Recommendations] Resume not found for user:",
        String(userId)
      );

      return res.status(404).json({
        success: false,
        message:
          "Resume data not found for this account. Please upload your resume again.",
        recommend_internships: [],
      });
    }

    // 3. Validate saved resume data
    if (
      !Array.isArray(resumeData.embedding) ||
      resumeData.embedding.length === 0
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Your resume embedding is missing. Please re-upload your resume.",
        recommend_internships: [],
      });
    }

    // 4. Request personalized recommendations from the ML service
    const mlResponse = await axios.post(
      "http://127.0.0.1:5001/recommend",
      {
        embedding: resumeData.embedding,
        filters,
        resumeSummary: resumeData.resumeReview || "",
        resumeJSONdata: resumeData.resumeJSONdata || {},
      },
      {
        timeout: 120000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 5. Normalize the response from Flask
    const result = mlResponse.data;
    const recommendations = Array.isArray(result)
      ? result
      : Array.isArray(result?.recommend_internships)
        ? result.recommend_internships
        : [];

    console.log(
      `[Recommendations] Returned ${recommendations.length} internships`
    );

    return res.status(200).json({
      success: true,
      message: recommendations.length
        ? "Internship recommendations generated successfully."
        : "No matching internships found. Try clearing your filters.",
      recommend_internships: recommendations,
    });
  } catch (err) {
    const isConnRefused =
      err.code === "ECONNREFUSED" ||
      err.message?.includes("ECONNREFUSED");

    if (isConnRefused) {
      console.error(
        "[Recommendations] ML engine is not running on port 5001."
      );

      return res.status(503).json({
        success: false,
        message:
          "Recommendation engine is offline. Please start the ML engine and try again.",
        error: "ML engine not running on port 5001",
        recommend_internships: [],
      });
    }

    console.error(
      "[Recommendations] Error:",
      err.response?.data || err.message
    );

    return res.status(err.response?.status || 500).json({
      success: false,
      message: "Failed to generate internship recommendations.",
      error: err.response?.data || err.message,
      recommend_internships: [],
    });
  }
};

export const getLocations = async (req, res) => {
  const { location } = req.body || {};

  if (!location || !location.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid location.",
    });
  }

  try {
    const locations = await Internship.aggregate([
      {
        $match: {
          locationName: {
            $regex: location.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        },
      },
      {
        $group: {
          _id: "$locationName",
        },
      },
      {
        $limit: 5,
      },
    ]);

    const uniqueLocations = locations
      .map((loc) => loc._id)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      locations: uniqueLocations,
    });
  } catch (err) {
    console.error("[Locations] Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Error fetching locations.",
    });
  }
};
