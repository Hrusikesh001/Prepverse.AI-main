import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import useConversation from "../stateManage/useConversation.js";
import { useNavigate } from "react-router-dom";
import ResumeProcessingPage from "../components/resumeProgressPage.jsx";
import { ThemeContext } from "../context/ThemeContext";

export default function ProfileInterviewForm() {
  const [topics, setTopics] = useState([""]);
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState("");
  const [numberOfQns, setNumberOfQns] = useState(5);
  const [loading, setLoading] = useState(false);
  const [openStepProgress, setOpenStepProgress] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const {
    setAccessInterviewPage,
    setInterviewData,
    interviewModelId,
    setInterviewModelId,
  } = useConversation();

  // Theme-based styles - matching the previous component
  const MaintextColor = theme === "dark" ? "text-gray-200" : "text-gray-900";
  const containerBg = theme === "dark" ? "bg-black" : "bg-gray-50";
  const cardBg = theme === "dark" ? "bg-orange-100" : "bg-orange-50";
  const textColor = theme === "dark" ? "text-gray-800" : "text-gray-900";
  const labelColor = theme === "dark" ? "text-gray-800" : "text-gray-700";
  const inputBg =
    theme === "dark"
      ? "bg-white border-gray-700 text-black"
      : "bg-white border-gray-300 text-gray-900";
  const inputFocus = "focus:ring-orange-500 focus:border-orange-500";
  const tipBg = theme === "dark" ? "bg-white" : "bg-orange-50";
  const tipBorder = theme === "dark" ? "border-gray-700" : "border-orange-200";
  const fileUploadBg =
    theme === "dark"
      ? "bg-white border-orange-500"
      : "bg-white border-gray-300";
  const fileUploadText = theme === "dark" ? "text-gray-800" : "text-gray-600";

  const handleTopicChange = (index, value) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const addTopicField = () => setTopics([...topics, ""]);

  const removeTopicField = (index) => {
    const updated = topics.filter((_, i) => i !== index);
    setTopics(updated);
  };

  const handleFileUpload = (e) => setResumeFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !role.trim() || !numberOfQns || !topics[0].trim()) {
      return toast.error("Please fill all required fields.");
    }

    if (numberOfQns <= 0 || numberOfQns > 25) {
      return toast.error("Please enter a number between 1 and 25");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("role", role);
    formData.append("numberOfQns", numberOfQns);
    topics.forEach((t) => formData.append("topics", t));

    try {
      setOpenStepProgress(true);
      const { data } = await axios.post(
        "http://localhost:8000/profileInterview/checkRoleValidity",
        formData,
        { withCredentials: true }
      );

      if (data.interviewModelId) {
        setInterviewModelId(data.interviewModelId);
      }

      setInterviewData({
        topic: topics.join(", "),
        role,
        numOfQns: numberOfQns,
      });

      setAccessInterviewPage(true);
      setTopics([""]);
      setResumeFile(null);
      setRole("");
      setNumberOfQns(5);
      navigate("/interviewPage");
    } catch (err) {
      console.log(err);
      setTopics([""]);
      setResumeFile(null);
      setRole("");
      setNumberOfQns(5);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (openStepProgress) {
    return <ResumeProcessingPage />;
  }

  return (
    <div
      className={`min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 ${containerBg}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-bold mb-3 ${MaintextColor}`}>
            Start Your <span className="text-orange-500">Resume-Based</span>{" "}
            Interview
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Upload your resume and customize your interview experience
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Information Section */}
          <div className="w-full lg:w-1/2">
            <div className={`p-8 rounded-2xl shadow-xl h-full ${cardBg}`}>
              <h2
                className={`text-2xl font-semibold mb-6 ${textColor} text-center`}
              >
                AI-Powered Resume Analysis
              </h2>

              {/* Benefits Section */}
              <div
                className={`p-4 rounded-lg border ${tipBg} ${tipBorder} mb-6`}
              >
                <h3
                  className={`font-semibold mb-3 flex items-center ${textColor}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 极 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Benefits of Resume-Based Interviews
                </h3>
                <ul
                  className={`text-sm space-y-2 ${
                    theme === "dark" ? "text-gray-800" : "text-gray-700"
                  }`}
                >
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Personalized
                    questions based on your experience
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Relevant
                    technical questions for your specific role
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Behavioral
                    questions tailored to your background
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Identify
                    strengths and areas for improvement
                  </li>
                </ul>
              </div>

              {/* How It Works Section */}
              <div
                className={`p-4 rounded-lg border ${tipBg} ${tipBorder} mb-6`}
              >
                <h3
                  className={`font-semibold mb-3 flex items-center ${textColor}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    viewBox="0 极 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  How It Works
                </h3>
                <ul
                  className={`text-sm space-y-2 ${
                    theme === "dark" ? "text-gray-800" : "text-gray-700"
                  }`}
                >
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">1.</span>Upload your
                    resume (PDF format)
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">2.</span>Specify your
                    target role
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">3.</span>Add topics
                    you want to focus on
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">4.</span>Our AI
                    analyzes your resume and generates personalized questions
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">5.</span>Practice
                    with tailored interview questions
                  </li>
                </ul>
              </div>

              {/* Tips Section */}
              <div className={`p-4 rounded-lg border ${tipBg} ${tipBorder}`}>
                <h3
                  className={`font-semibold mb-3 flex items-center ${textColor}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/s极"
                    className="h-5 w-5 mr-2 text-orange-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tips for Success
                </h3>
                <ul
                  className={`text-sm space-y-2 ${
                    theme === "dark" ? "text-gray-800" : "text-gray-700"
                  }`}
                >
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Choose a
                    quiet environment with good lighting
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Test your
                    microphone and camera beforehand
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Be prepared
                    to discuss your resume in detail
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>Use the STAR
                    method for behavioral questions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2">
            <div className={`p-8 rounded-2xl shadow-xl h-full ${cardBg}`}>
              <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
                Interview Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Upload */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${labelColor}`}
                  >
                    Upload Resume (PDF)
                  </label>
                  {!resumeFile ? (
                    <div
                      className={`relative w-full border-2 border-dashed rounded-lg p-4 ${fileUploadBg} hover:bg-opacity-80 cursor-pointer transition`}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        id="resume-upload"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mx-auto text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                          <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                        </svg>
                        <p className={`text-sm mt-2 ${fileUploadText}`}>
                          Click to upload your resume (PDF)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center justify-between p-3 rounded-md border ${inputBg}`}
                    >
                      <span className="text-sm truncate">
                        📄 {resumeFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="ml-3 px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${labelColor}`}
                  >
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Frontend Developer, Data Scientist"
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${inputFocus} transition duration-200 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                {/* Number of Questions */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${labelColor}`}
                  >
                    Number of Questions
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={numberOfQns}
                      onChange={(e) => setNumberOfQns(e.target.value)}
                      min="1"
                      max="25"
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${inputFocus} transition duration-200 focus:outline-none focus:ring-2`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        / 25
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Maximum 25 questions allowed
                  </p>
                </div>

                {/* Topics */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${labelColor}`}
                  >
                    Focus Areas/Topics
                  </label>
                  {topics.map((topic, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) =>
                          handleTopicChange(index, e.target.value)
                        }
                        placeholder={`Topic ${
                          index + 1
                        } (e.g., React, Algorithms, Leadership)`}
                        className={`flex-grow px-4 py-3 rounded-lg border ${inputBg} ${inputFocus} transition duration-200 focus:outline-none focus:ring-2 text-sm`}
                      />
                      {topics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTopicField(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTopicField}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md text-sm"
                  >
                    + Add Topic
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Start Interview
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
