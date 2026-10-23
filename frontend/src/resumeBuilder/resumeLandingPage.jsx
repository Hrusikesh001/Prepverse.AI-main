import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function ResumeLandingPage() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const stepVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  const featureVariant = {
    hover: {
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  // Steps for creating a resume
  const steps = [
    {
      title: "Choose a Template",
      description: "Select from professional, ATS-friendly templates designed to showcase your skills."
    },
    {
      title: "Fill Your Details",
      description: "Easily enter your personal, educational, and professional information using simple forms."
    },
    {
      title: "Customize Design",
      description: "Adjust colors, fonts, and layout to match your personal style and industry standards."
    },
    {
      title: "Download & Share",
      description: "Download your resume as a PDF or share it directly with employers through a unique link."
    }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col ${theme === "dark" ? "bg-black text-white" : "bg-gradient-to-br from-gray-100 to-white text-gray-800"}`}>
      <div className="flex flex-col items-center px-6 lg:px-24 py-12 relative overflow-hidden font-sans mt-16">
        {/* Main Content - Centered */}
        <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto relative z-10">
          
          {/* Hero Section */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1 }}
            className="flex flex-col items-center text-center gap-6 mb-30"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight pt-1">
              Create Your Professional <span className="text-orange-500">Resume in Minutes</span>
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mt-1 font-light ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Build a standout, ATS-optimized resume with our intuitive builder. Impress employers and accelerate your career journey.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#ff6900", color: "white" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/resume/selectResume")}
              className={`font-bold px-5 py-2.5 rounded-lg text-base border-2 transition mt-8 shadow-lg hover:shadow-orange-500/30 ${theme === "dark" ? "bg-black text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white" : "bg-white text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"}`}
            >
              Create Your Resume Now →
            </motion.button>
          </motion.div>

          {/* Steps Section */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full mb-20 relative"
          >
            <h2 className="text-3xl font-semibold text-center mb-16">Craft Your Perfect Resume in few Simple Steps</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={stepVariant}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl shadow-lg transition-colors duration-300 hover:scale-105 hover:shadow-orange-400/40 cursor-pointer border relative ${
                    theme === "dark" 
                      ? "bg-orange-100 border-gray-700" 
                      : "bg-orange-50 border-gray-200"
                  }`}
                >
                  {/* Step number in orange circle */}
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg mb-5 mx-auto">
                    {index + 1}
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 text-center ${
                    theme === "dark" ? "text-gray-800" : "text-gray-800"
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-base leading-relaxed text-center ${
                    theme === "dark" ? "text-gray-700" : "text-gray-600"
                  }`}>
                    {step.description}
                  </p>
                  
                  {/* Connector line between boxes (visible on desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-0.5 bg-orange-500"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full mb-20"
          >
            <h2 className="text-3xl font-semibold text-center mb-12">
              Why <span className="text-orange-500">Choose Our Resume Builder</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                variants={featureVariant}
                whileHover="hover"
                className={`p-6 rounded-xl shadow-lg transition-colors duration-300 hover:scale-105 hover:shadow-orange-400/40 cursor-pointer border flex flex-col items-center text-center ${
                  theme === "dark" 
                    ? "bg-orange-100 border-gray-700" 
                    : "bg-orange-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center mb-5">
                  <div className="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-orange-500">ATS Optimized</h3>
                </div>
                <p className={`text-base ${theme === "dark" ? "text-gray-700" : "text-gray-600"}`}>
                  Resumes designed to pass through Applicant Tracking Systems and get you noticed
                </p>
              </motion.div>
              
              <motion.div 
                variants={featureVariant}
                whileHover="hover"
                className={`p-6 rounded-xl shadow-lg transition-colors duration-300 hover:scale-105 hover:shadow-orange-400/40 cursor-pointer border flex flex-col items-center text-center ${
                  theme === "dark" 
                    ? "bg-orange-100 border-gray-700" 
                    : "bg-orange-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center mb-5">
                  <div className="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 16" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-orange-500">Easy Customization</h3>
                </div>
                <p className={`text-base ${theme === "dark" ? "text-gray-700" : "text-gray-600"}`}>
                  Change colors, fonts, and layouts with just a few clicks to match your personal brand
                </p>
              </motion.div>
              
              <motion.div 
                variants={featureVariant}
                whileHover="hover"
                className={`p-6 rounded-xl shadow-lg transition-colors duration-300 hover:scale-105 hover:shadow-orange-400/40 cursor-pointer border flex flex-col items-center text-center ${
                  theme === "dark" 
                    ? "bg-orange-100 border-gray-700" 
                    : "bg-orange-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center mb-5">
                  <div className="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-orange-500">Instant Download</h3>
                </div>
                <p className={`text-base ${theme === "dark" ? "text-gray-700" : "text-gray-600"}`}>
                  Get your professionally formatted PDF resume immediately, ready to send to employers
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center w-full max-w-4xl mb-12"
          >
            <h2 className="text-3xl font-semibold mb-6">Ready to Build Your Professional Resume?</h2>
            <p className={`max-w-2xl mx-auto mb-8 text-xl font-light ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Join thousands of professionals who have landed interviews with our powerful resume builder.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#ff6900", color: "white" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/resume/selectResume")}
              className={`font-bold px-5 py-2.5 rounded-lg text-base border-2 transition shadow-lg hover:shadow-orange-500/30 ${theme === "dark" ? "bg-black text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white" : "bg-white text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"}`}
            >
              Start Building Now 
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResumeLandingPage;