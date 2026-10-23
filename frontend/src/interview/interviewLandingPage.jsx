import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CheckCameraAndMic from "../components/checkCameraAndMic";
import { ThemeContext } from "../context/ThemeContext";

// ✅ Optional: Add Google Fonts dynamically
const addGoogleFonts = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};
addGoogleFonts();

export function MockInterviewLandingPage() {
  const navigate = useNavigate();

  // ✅ Get theme context
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";
  const primary = "#ff6900";

  const [profileForm, setProfileForm] = useState(false);
  const [topicForm, setTopicForm] = useState(false);

  if (profileForm) {
    return (
      <CheckCameraAndMic onContinue={() => navigate("/profileInterviewForm")} />
    );
  }

  if (topicForm) {
    return <CheckCameraAndMic onContinue={() => navigate("/interviewForm")} />;
  }

  // ✅ Dynamic theme-based styles
  const bgClass = darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900";
  const secondaryTextColor = darkMode ? "text-gray-300" : "text-gray-600";
  const featureBg = darkMode ? "bg-orange-100" : "bg-orange-50";
  const featureHover = darkMode ? "hover:bg-orange-500" : "hover:bg-orange-100";

  return (
    <main
      className={`relative w-full min-h-screen px-6 py-16 flex items-center justify-center overflow-hidden ${bgClass}`}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* 🔵 Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute w-[500px] h-[500px] rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob top-0 -left-32"
          style={{ backgroundColor: primary }}
        ></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-500 mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-2000 bottom-0 right-0"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-yellow-400 mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-4000 top-1/2 left-1/2"></div>
      </div>

      {/* 🔵 Hero Section */}
      <motion.section
        className="max-w-4xl text-center px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          <span style={{ color: primary }}>Master Interviews</span> with AI
        </h1>
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
          AI-Powered Mock Sessions
        </h2>
        <p
          className={`text-lg md:text-xl max-w-3xl mx-auto ${secondaryTextColor} mb-10`}
        >
          Practice focused or personalized interviews and get instant AI
          feedback to level up your skills.
        </p>

        {/* 🔵 Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button
            onClick={() => setTopicForm(true)}
            className={`px-10 py-4 rounded-full border-2 text-lg font-semibold shadow-md transition-all duration-300 
              border-[${primary}] text-[${primary}] 
              hover:bg-[${primary}] hover:text-white 
              focus:outline-none focus:ring-4 focus:ring-orange-400`}
          >
            Topic-Based Mock
          </button>

          <button
            onClick={() => setProfileForm(true)}
            className={`px-10 py-4 rounded-full text-lg font-semibold shadow-md transition-all duration-300 text-white
              `}
            style={{
              backgroundColor: primary,
              borderColor: primary,
            }}
          >
            Profile-Based Mock
          </button>
        </motion.div>

        {/* 🔵 Features */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {[
            "Real-time feedback",
            "Performance analytics",
            "Customized questions",
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`flex items-center py-2 px-4 rounded-full shadow-sm transition-colors duration-300 ${featureBg} ${featureHover}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke={primary}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* 🔵 Blob animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </main>
  );
}
