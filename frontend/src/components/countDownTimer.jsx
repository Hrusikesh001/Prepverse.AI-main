

import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const CountdownTimer = ({ duration = 30, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="relative w-16 h-16">
      <svg className="transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="45"
          className="stroke-current text-gray-300"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="50" cy="50" r="45"
          stroke="currentColor"
          style={{ color: "#ff6900" }}
          strokeWidth="10"
          strokeDasharray="282.6"
          strokeDashoffset={(282.6 * (100 - percentage)) / 100}
          fill="none"
          initial={false}
          animate={{ strokeDashoffset: (282.6 * (100 - percentage)) / 100 }}
          transition={{ duration: 1 }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;

