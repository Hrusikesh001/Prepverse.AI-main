import React from "react";
import {
  SmartToy,
  Description,
  Terminal,
  Insights,
  Timeline,
  Translate,
} from "@mui/icons-material";

const features = [
  {
    icon: <SmartToy fontSize="large" />,
    title: "AI-Powered Interviews",
    description:
      "Experience real-time mock interviews tailored to your career goals.",
    gradient: "from-indigo-500 to-purple-700",
  },
  {
    icon: <Description fontSize="large" />,
    title: "Smart Resume Builder",
    description:
      "Generate professional resumes instantly based on your performance.",
    gradient: "from-pink-500 to-rose-700",
  },
  {
    icon: <Terminal fontSize="large" />,
    title: "Coding Skill Quizzes",
    description: "Test your knowledge in your chosen programming language.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: <Insights fontSize="large" />,
    title: "Instant Feedback & Insights",
    description:
      "Get personalized suggestions and performance metrics.",
    gradient: "from-green-500 to-emerald-700",
  },
  {
    icon: <Timeline fontSize="large" />,
    title: "Track Progress",
    description: "Analyze your improvement and readiness over time.",
    gradient: "from-yellow-400 to-orange-600",
  },
  {
    icon: <Translate fontSize="large" />,
    title: "Custom Language Support",
    description:
      "Choose your preferred programming language and interview type.",
    gradient: "from-teal-500 to-blue-700",
  },
];

const FeatureGrid = () => {
  return (
    <div className="px-6 md:px-16 py-16 bg-black text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-purple-400">AIspire Features</h2>
        <p className="text-gray-300 mt-2 text-lg">
          Everything you need to ace interviews and build your career
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-2xl shadow-xl backdrop-blur-md hover:scale-[1.03] transition-transform duration-300 flex flex-col gap-4`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
