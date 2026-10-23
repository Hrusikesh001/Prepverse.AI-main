import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, DollarSign, Calendar, Briefcase, Rocket } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import useInternships from '../stateManage/useInternships.js';
import useConversation from "../stateManage/useConversation.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import server from "../environment.js";
import ResumeProcessingPage from "../components/resumeProgressPage.jsx";

const InternshipDetails = () => {
  const { id } = useParams();
  const { searchInternships } = useInternships();
  const internshipsData = searchInternships;
  const internship = internshipsData.find((item) => item._id === id);
  const { setInterviewData, setInterviewModelId, setAccessInterviewPage } = useConversation();
  const [openStepProgress, setOpenStepProgress] = useState(false);

  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  if (!internship) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0D0D0D] text-white" : "bg-white text-black"
          }`}
      >
        <p>Internship not found.</p>
      </div>
    );
  }

  const handleAttendClick = async (topics, role, numOfQns, interviewId) => {
    console.log("Number of questions are : "+ numOfQns);
    try {
      setOpenStepProgress(true);
      console.log("Number of qns in frontend: "+numOfQns);
      const { data } = await axios.post(
        `${server}/profileInterview/profileBasedInterview`,
        {  topics, role, numberOfQns: numOfQns, interviewId},
        { withCredentials: true }
      );

      if (data?.interviewModelId) {
        setAccessInterviewPage(true);
        setInterviewData({ topic: topics, role, numOfQns });
        setInterviewModelId(data?.interviewModelId);
        setOpenStepProgress(false);
        navigate("/interviewPage");
      }
    } catch (err) {
      console.log(err);
      setOpenStepProgress(false);
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };


  const Accent = ({ children }) => (
    <span className="text-[#FF6900]">{children}</span>
  );

  if(openStepProgress){
    return(
      <ResumeProcessingPage/>
    );
  }

  return (
    <div
      className={`min-h-screen w-full font-inter px-6 py-12 transition-colors duration-500 ${theme === "dark"
        ? "bg-[#0D0D0D] text-white"
        : "bg-[#FFFFFF] text-[#1A1A1A]"
        }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Title & Company */}
        <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-2">
          {internship.jobTitle}
        </h1>
        <p
          className={`text-lg mb-6 ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
            }`}
        >
          {internship.company}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div
            className={`flex items-center text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
          >
            <Briefcase size={16} className="mr-2 text-[#FF6900]" />
            {internship.jobType} • {internship.duration}
          </div>
          <div
            className={`flex items-center text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
          >
            <DollarSign size={16} className="mr-2 text-[#FF6900]" />
            {internship.stipend === "0" ? "Unpaid" : internship.stipend}
          </div>
          <div
            className={`flex items-center text-sm ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
          >
            <Calendar size={16} className="mr-2 text-[#FF6900]" />
            Apply by {internship.lastDate}
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-8">
          {internship.jobTopic.split(",").map((topic, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-md text-sm ${theme === "dark"
                ? "bg-[#141414] border border-[#2A2A2A] text-[#E2E2E2]"
                : "bg-[#F9F9F9] border border-[#EAEAEA] text-[#333]"
                }`}
            >
              {topic.trim()}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold font-poppins mb-4">
            Internship <Accent>Details</Accent>
          </h2>
          <p
            className={`text-base leading-relaxed whitespace-pre-line ${theme === "dark" ? "text-[#B3B3B3]" : "text-[#555]"
              }`}
          >
            {internship.description}
          </p>
        </div>

        {/* Apply Section */}
        <div
          className={`py-8 border-t text-center ${theme === "dark" ? "border-[#2A2A2A]" : "border-[#EAEAEA]"
            }`}
        >
          <button
            onClick={() =>
              handleAttendClick(
                internship.jobTopic,
                internship.jobRole,
                internship.numOfQns,
                internship._id
              )
            }
            className="px-8 py-3 rounded-full font-medium 
          bg-[#FF6900] text-white hover:bg-[#e65f00] 
            transition-all duration-300 inline-flex items-center"
          >
            Apply Now
            <Rocket size={18} className="ml-2" />
          </button>
          <div className="mt-4">
            <Link
              to="/candidate/attend"
              className={`text-sm ${theme === "dark"
                ? "text-[#B3B3B3] hover:text-white"
                : "text-[#555] hover:text-black"
                }`}
            >
              ← Back to Internships
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
