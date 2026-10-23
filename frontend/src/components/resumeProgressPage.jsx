import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useStepCount from '../stateManage/useStepCount.js'
import { useSocketContext } from '../context/socketContext.jsx'
import { ThemeContext } from "../context/ThemeContext";

const checklistSteps = [
  "Verifying job title and role",
  "Fetching Resume Data",
  "Scoring resume",
  "Generating Questions",
  "Preparing interview",
];

export default function ResumeProcessingPage() {
  const {
    currentStep,
    setCurrentStep,
    showInstructions,
    setShowInstructions,
    showAnalysis,
    setShowAnalysis,
    resumeAnalysis,
    setResumeAnalysis,
  } = useStepCount();

  const { socket } = useSocketContext();
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";
  
  const bgColor = darkMode ? "bg-black" : "bg-gray-100";
  const containerBg = darkMode ? "bg-orange-100" : "bg-orange-50";

  useEffect(() => {
    if (!socket) return;
    
    socket.on("validateRoleAndTopic", ({ valid }) => {
      setCurrentStep(1);
    });

    socket.on("resumeParsed", () => {
      setCurrentStep(2);
    });

    socket.on("resumeScore", ({ totalScore, summaryFeedback }) => {
      setResumeAnalysis({
        atsScore: totalScore,
        overallReview: summaryFeedback,
      });
      setShowAnalysis(true);
      setCurrentStep(3);
    });

    socket.on("questionsGenerated", () => {
      setCurrentStep(4);
    });

    return () => {
      socket.off("validateRoleAndTopic");
      socket.off("resumeParsed");
      socket.off("resumeScore");
      socket.off("questionsGenerated");
    };
  }, [socket]);

  useEffect(() => {
    setResumeAnalysis({});
    setShowAnalysis(false);
    setCurrentStep(0);
  }, []);

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center px-6 py-10 overflow-hidden w-[100vw]`}>
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-400/30 to-orange-500/30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.3,
              transition: {
                duration: Math.random() * 30 + 20,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-center drop-shadow-lg leading-tight mt-8"
      >
        Preparing Your <br className="sm:hidden" /> AI Interview
      </motion.h1>

      {/* Main content container */}
      <div className={`relative w-full max-w-4xl ${containerBg} backdrop-blur-lg rounded-2xl border border-gray-300 dark:border-gray-600 p-8 shadow-2xl overflow-hidden`}>
        {/* Glow effect */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-orange-600/20 blur-3xl"></div>

        {/* Timeline and content */}
        <div className="relative flex flex-col lg:flex-row gap-8 z-10">
          {/* Timeline */}
          <div className="lg:w-1/2">
            <div className="relative w-full">
              {/* Line */}
              <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 rounded-full shadow-lg"></div>

              {/* Steps */}
              <div className="space-y-8">
                {checklistSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: index <= currentStep ? 1 : 0.4,
                      x: 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center 
                      ${index < currentStep
                          ? "bg-orange-600 shadow-orange-600/30"
                          : index === currentStep
                            ? "bg-orange-500 shadow-orange-500/30 animate-pulse"
                            : "bg-gray-400 shadow-gray-400/30"
                        } text-white shadow-lg transition-all duration-300`}
                    >
                      {index < currentStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : index === currentStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <span className="text-white">{index + 1}</span>
                      )}
                    </div>

                    <div>
                      <p className={`text-lg font-medium ${index <= currentStep ? (darkMode ? "text-gray-900" : "text-gray-900") : "text-gray-500"} transition-colors duration-300`}>
                        {step}
                      </p>
                      {index <= currentStep && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`text-sm ${darkMode ? "text-gray-700" : "text-gray-600"} mt-1`}
                        >
                          {index < currentStep ? "Completed" : index === currentStep ? "In progress..." : ""}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side content */}
          <div className="lg:w-1/2 space-y-6">
            {/* Resume Analysis Box - appears after step 2 */}
            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resume Analysis</h3>
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                        <span className="text-2xl font-bold text-white">{resumeAnalysis.atsScore}</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-bold text-orange-600 dark:text-orange-500 border border-orange-500">
                        ATS Score
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-500 mb-2">OVERALL REVIEW</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {resumeAnalysis.overallReview}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between text-xs">
                    <span className={
                      resumeAnalysis.atsScore > 80
                        ? "text-green-600 dark:text-green-500"
                        : resumeAnalysis.atsScore > 60
                          ? "text-blue-600 dark:text-blue-500"
                          : resumeAnalysis.atsScore > 40
                            ? "text-yellow-600 dark:text-yellow-500"
                            : "text-red-600 dark:text-red-500"
                    }>
                      {
                        resumeAnalysis.atsScore > 80
                          ? "Highly Competitive"
                          : resumeAnalysis.atsScore > 60
                            ? "Competitive"
                            : resumeAnalysis.atsScore > 40
                              ? "Needs Improvement"
                              : "Weak"
                      }
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">Score: {resumeAnalysis.atsScore}/100</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round((currentStep) / checklistSteps.length * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep) / checklistSteps.length * 100}%` }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                />
              </div>
            </div>

            {/* Instructions Toggle */}
            <div className="pt-4">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {showInstructions ? (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Hide Instructions
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Show Interview Instructions
                  </span>
                )}
              </button>

              {/* Instructions Content */}
              {showInstructions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-xl space-y-4 overflow-hidden"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Interview Instructions
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-orange-600 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Do not move your head frequently — after 5 warnings, the interview will be auto-terminated.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-orange-600 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Each question has a timer. Keep an eye on the countdown and stay focused.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-orange-600 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Ensure your camera and microphone are working properly.</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-orange-600 mr-2 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">Be in a well-lit, quiet environment for the best experience.</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}