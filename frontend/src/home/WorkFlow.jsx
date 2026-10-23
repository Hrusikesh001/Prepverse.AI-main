import React from "react";
import {
  FaUserCheck,
  FaRobot,
  FaFileAlt,
  FaCode,
  FaChartLine,
  FaSyncAlt,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserCheck size={30} />,
    title: "User Onboarding",
    desc: "Set your profile and career goals to get a tailored experience.",
    color: "text-blue-500",
  },
  {
    icon: <FaRobot size={30} />,
    title: "AI Interview",
    desc: "Practice with real-time AI-driven mock interviews.",
    color: "text-purple-500",
  },
  {
    icon: <FaFileAlt size={30} />,
    title: "Resume Generator",
    desc: "Get your resume instantly crafted based on your answers and goals.",
    color: "text-pink-500",
  },
  {
    icon: <FaCode size={30} />,
    title: "Skill Quiz",
    desc: "Test yourself in your chosen language with custom quizzes.",
    color: "text-yellow-400",
  },
  {
    icon: <FaChartLine size={30} />,
    title: "Personalized Feedback",
    desc: "Get AI-generated insights to improve your performance.",
    color: "text-green-400",
  },
  {
    icon: <FaSyncAlt size={30} />,
    title: "Track Growth",
    desc: "Monitor your improvement and prepare smarter every day.",
    color: "text-orange-500",
  },
];

const WorkFlow = () => {
  return (
    <div className="bg-black text-white py-16 px-4 relative overflow-hidden w-[80vw]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          How AIspire Works
        </h2>
        <p className="text-lg text-gray-300 mb-16">
          The smartest AI interview experience built just for you
        </p>

        <div className="relative">
          {/* Animated Connecting Line */}
          <div className="hidden md:block absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse z-0" />

          {/* Grid Items */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-10 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group transition-transform duration-300"
              >
                <div
                  className={`bg-white bg-opacity-10 p-6 rounded-full mb-4 ${step.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>
                <h3 className={`text-xl font-semibold ${step.color}`}>{step.title}</h3>
                <p className="text-gray-400 mt-2 text-sm max-w-[160px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkFlow;
