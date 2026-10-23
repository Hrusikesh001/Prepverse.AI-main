import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const QuizResult = ({ score, total, subject, level }) => {
  const { theme } = useContext(ThemeContext);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const percentage = Math.round((score / total) * 100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);

  // Determine performance
  let performance = "";
  if (percentage >= 90) performance = "Excellent";
  else if (percentage >= 75) performance = "Great";
  else if (percentage >= 50) performance = "Good";
  else performance = "Needs Improvement";

  // Trigger effects on mount
  useEffect(() => {
    if (percentage >= 50) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // stop confetti after 5s
      return () => clearTimeout(timer);
    } else {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1000); // shake once
      return () => clearTimeout(timer);
    }
  }, []);

  // Card animation variants
  const cardVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-8">
      {/* Confetti for good performance */}
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}

      <motion.div
        className={`relative rounded-3xl p-8 border transition-shadow duration-300
          ${theme === "dark" ? "bg-orange-100 border-gray-700 text-gray-900 shadow-md hover:shadow-lg" 
                             : "bg-orange-50 border-gray-300 text-gray-900 shadow-md hover:shadow-lg"}`}
        variants={cardVariants}
        animate={shake ? "shake" : "idle"}
        whileHover="hover"
      >
        {/* Title */}
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins">{performance},</span>{" "}
          <span className="text-[#ff6900] font-bold">{authUser.user.name}</span>!
        </motion.h2>

        {/* Subject & Level */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
          {/* Subject Card */}
          <div
            className={`flex flex-col items-center justify-center px-6 py-4 rounded-2xl transition-all duration-300
              ${theme === "dark" ? "bg-orange-50 text-gray-800 shadow-inner hover:shadow-[0_0_12px_2px_rgba(255,165,0,0.3)]" 
                                   : "bg-orange-100 text-gray-800 shadow-inner hover:shadow-[0_0_12px_2px_rgba(255,165,0,0.3)]"}`}
          >
            <span className="text-black-400 text-sm">Subject</span>
            <span className="font-semibold mt-1 text-lg">{subject}</span>
          </div>

          {/* Level Card */}
          <div
            className={`flex flex-col items-center justify-center px-6 py-4 rounded-2xl transition-all duration-300
              ${theme === "dark" ? "bg-orange-50 text-gray-800 shadow-inner hover:shadow-[0_0_12px_2px_rgba(255,165,0,0.3)]" 
                                   : "bg-orange-100 text-gray-800 shadow-inner hover:shadow-[0_0_12px_2px_rgba(255,165,0,0.3)]"}`}
          >
            <span className="text-black-400 text-sm">Level</span>
            <span className="font-semibold mt-1 text-lg">{level}</span>
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <p className="text-gray-700 text-lg mb-2">Your Score</p>
          <motion.div
            className="text-5xl sm:text-6xl font-bold text-[#ff6900] mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            {score} / {total}
          </motion.div>
          <p className="text-gray-700 text-lg">
            Accuracy: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-8 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #ff6900, #ff9c3c)" }}
          ></div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/quiz")}
            className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-[#ff6900] to-[#ff9c3c] text-white font-semibold rounded-2xl shadow hover:scale-105 transition-transform duration-200"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate("/")}
            className={`w-full sm:w-auto px-10 py-3 rounded-2xl border font-semibold transition-colors duration-200
              ${theme === "dark" ? "bg-gray-800 text-gray-200 border-gray-600 hover:border-[#ff6900] hover:text-[#ff6900]" 
                                   : "bg-gray-300 text-gray-900 border-gray-400 hover:border-[#ff6900] hover:text-[#ff6900]"}`}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResult;