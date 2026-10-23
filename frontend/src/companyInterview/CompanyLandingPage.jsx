import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Briefcase, BarChart3, Settings } from "lucide-react";

function CompanyDashboard() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [createInterview, setCreateInterview] = useState(false);

  const bgMain = theme === "dark" ? "bg-black" : "bg-gray-50";
  const headerText = theme === "dark" ? "text-white" : "text-gray-900";
  const subText = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-orange-100" : "bg-orange-50";
  const cardBorder = theme === "dark" ? "border-[#2A2A2A]" : "border-gray-200";
  const cardText = theme === "dark" ? "text-black" : "text-gray-900";
  const cardSubText = theme === "dark" ? "text-gray-700" : "text-gray-600";
  const cardHoverShadow = theme === "dark" ? "hover:shadow-[#FF6900]/30" : "hover:shadow-orange-400/30";
  const cardHoverBorder = theme === "dark" ? "hover:border-[#FF6900]" : "hover:border-orange-400";

  const actions = [
    {
      title: "Create Interview",
      description: "Set up a new AI interview for candidates.",
      path: "/company/createInterview",
      icon: <Briefcase className="w-8 h-8 text-[#FF6900]" />,
    },
    {
      title: "Performance Reports",
      description: "Check candidate scores and AI analytics.",
      path: "/company/createInterview",
      icon: <BarChart3 className="w-8 h-8 text-[#FF6900]" />,
    },
    {
      title: "Settings",
      description: "Configure your company interview preferences.",
      path: "/company/settings",
      icon: <Settings className="w-8 h-8 text-[#FF6900]" />,
    },
  ];

  if (createInterview) {
    return navigate("/company/createInterviewForm");
  }

  return (
    <div className={`${bgMain} w-full h-[100vh] max-h-screen text-white flex flex-col items-center px-6 pt-30 py-16 transition-colors duration-500`}>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={`text-center text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FF6900] to-[#FF6900] bg-clip-text text-transparent drop-shadow-md`}
      >
        Company Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className={`text-center text-lg md:text-xl mt-4 max-w-3xl ${subText}`}
      >
        Manage everything from one place: interviews, candidates, and performance reports.
      </motion.p>

      {/* Dashboard Actions - Adjusted for 3 boxes */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-2xl ${cardBg} border ${cardBorder} shadow-lg ${cardHoverShadow} ${cardHoverBorder} backdrop-blur-md cursor-pointer transition h-full`}
            onClick={() => {
              if (action.title === "Create Interview") {
                setCreateInterview(true);   
              } else {
                navigate(action.path);      
              }
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#FF6900]/10 rounded-xl">
                {action.icon}
              </div>
              <h2 className={`text-2xl font-semibold ${cardText}`}>{action.title}</h2>
            </div>
            <p className={`text-sm leading-relaxed ${cardSubText}`}>{action.description}</p>
          </motion.div>

        ))}
      </div>
    </div>
  );
}

export default CompanyDashboard;