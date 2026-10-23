import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

// Inline SVG components
const SearchIcon = ({ color }) => (
  <svg className={`w-10 h-10 mx-auto mb-3 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

const MicrophoneIcon = ({ color }) => (
  <svg className={`w-10 h-10 mx-auto mb-3 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v11m0 0a3 3 0 006 0V12m-6 0a3 3 0 01-6 0V12m0 0V5a3 3 0 016 0v7m-6 0H5m7 6v4m0 0h4m-4 0H8"></path>
  </svg>
);

const UserCircleIcon = ({ color }) => (
  <svg className={`w-10 h-10 mx-auto mb-3 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A7.938 7.938 0 0012 20a7.938 7.938 0 006.879-2.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

function CandidateLandingPage() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // ✅ Text colors (separately tuned for readability)
  const headingText = theme === "dark" ? "text-white" : "text-gray-900"; // Main heading
  const highlightText = "text-[#FF6900]"; // Always orange
  const subHeadingText = theme === "dark" ? "text-gray-300" : "text-gray-700"; // Paragraphs
  const cardTitleText = theme === "dark" ? "text-gray-900" : "text-gray-800"; // Card heading
  const cardDescText = theme === "dark" ? "text-gray-700" : "text-gray-600"; // Card description

  // Glow for background circles
  const accentGlow = theme === "dark" ? "bg-[#FF6900] opacity-10" : "bg-orange-400 opacity-20";

  // ✅ Fixed card background
  const cardBg = theme === "dark" ? "bg-orange-100" : "bg-orange-50";
  const cardShadowHover = theme === "dark" ? "hover:shadow-orange-400/40" : "hover:shadow-gray-400/40";
  const iconColor = theme === "dark" ? "text-[#FF6900]" : "text-orange-600";

  const features = [
    {
      title: "Search Jobs & Internships",
      description: "Find opportunities by company, role, or keyword",
      icon: <SearchIcon color={iconColor} />,
    },
    {
      title: "Voice & Face Detection",
      description: "Interactive interviews with AI-powered verification",
      icon: <MicrophoneIcon color={iconColor} />,
    },
    {
      title: "AI Guidance & Feedback",
      description: "Get personalized tips to improve your performance",
      icon: <UserCircleIcon color={iconColor} />,
    },
  ];

  return (
    <div
      className={`relative w-full min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      } flex flex-col items-center justify-center px-6 overflow-hidden transition-colors duration-500`}
    >
      {/* Decorative Glow Circles */}
      <div
        className={`absolute -top-40 -right-40 w-[400px] h-[400px] ${accentGlow} blur-[160px] rounded-full animate-pulse`}
      ></div>
      <div
        className={`absolute -bottom-40 -left-40 w-[400px] h-[400px] ${accentGlow} blur-[160px] rounded-full animate-pulse`}
      ></div>

      {/* Hero Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        className={`text-center text-5xl md:text-7xl font-poppins font-bold tracking-tight leading-tight ${headingText}`}
      >
        Crack Your  <span className={`${highlightText} drop-shadow-lg`}>Next Interview</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.6 }}
  className={`text-center text-lg md:text-xl mt-6 max-w-2xl font-inter ${subHeadingText}`}
>
  Get ready to{" "}
  <span className={`font-semibold ${headingText}`}>practice, prepare, and crack interviews</span>{" "}
  with AI-driven mock sessions tailored to real company standards.
</motion.p>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl text-center"
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg ${cardBg} transition-colors duration-300 hover:scale-105 ${cardShadowHover} cursor-pointer`}
          >
            {feature.icon}
            <h3 className={`font-bold text-lg ${cardTitleText}`}>{feature.title}</h3>
            <p className={`mt-2 text-sm ${cardDescText}`}>{feature.description}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-6">
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="px-10 py-4 bg-[#FF6900] text-white font-semibold rounded-full shadow-[0_0_20px_-5px_rgba(255,105,0,0.4)] hover:bg-[#E85F00] transition"
          onClick={() => navigate("/candidate/attend")}
        >
          Attend Interviews
        </motion.button>

        {/* <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#FF6900", color: "#fff" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="px-10 py-4 border border-[#FF6900] text-[#FF6900] font-semibold rounded-full hover:bg-[#FF6900] hover:text-white transition"
        >
          Learn More
        </motion.button> */}
      </div>
    </div>
  );
}

export default CandidateLandingPage;
