
import React from "react";

const features = [
  {
    emoji: "🎙️",
    title: "AI-Powered Mock Interviews",
    desc: "Simulate real interviews with our AI. Choose your role and topic to start, or upload your resume and job description to generate a fully personalized experience. Get instant feedback, score breakdowns, and improvement suggestions.",
  },
  {
    emoji: "📄",
    title: "Smart Resume Builder",
    desc: "Build polished resumes using modern templates. Personalize content section-wise or auto-generate based on your job role. Export and apply instantly.",
  },
  {
    emoji: "📊",
    title: "ATS Score Analyzer",
    desc: "Upload your resume and job description to get an ATS score. Find keyword gaps, formatting issues, and get tips to improve your chances of selection.",
  },
  {
    emoji: "🧠",
    title: "Personalized Quiz Generator",
    desc: "Choose your preferred skills or topics (like DSA, DBMS, Web Dev, etc.) and get a personalized quiz. Practice smartly with explanations and feedback.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center px-6 py-20 space-y-20 bg-gradient-to-b from-black via-neutral-950 to-neutral-900 text-white">

      {features.map((feature, idx) => (
        <div
          key={idx}
          className="max-w-5xl w-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-md hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 group"
        >
          <h2 className="text-3xl font-semibold mb-3 text-white group-hover:text-emerald-400 transition">
            {feature.emoji} {feature.title}
          </h2>
          <p className="text-neutral-300 leading-relaxed group-hover:text-white transition">
            {feature.desc}
          </p>
        </div>
      ))}

      <div className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white text-center py-16 px-6 rounded-2xl shadow-md mt-12">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Ready to enter the Prepverse?
        </h2>
        <p className="mb-6 text-neutral-100 text-lg">
          Start your AI-powered preparation today — mock interviews, resume help, and more!
        </p>
        <button className="px-8 py-3 bg-black/90 text-white rounded-full border border-white hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-white/20">
          🚀 Launch AI Interview
        </button>
      </div>
    </div>
  );
};

export default FeaturesSection;
