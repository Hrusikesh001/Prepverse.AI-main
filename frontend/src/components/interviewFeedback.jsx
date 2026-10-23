import React, { useEffect, useState, useContext } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaUser,
  FaEnvelope,
  FaAward,
  FaListAlt,
} from "react-icons/fa";
import "animate.css";
import useConversation from "../stateManage/useConversation";
import { ThemeContext } from "../context/ThemeContext";

const InterviewFeedback = ({ data, onBack }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { setInterviewModelId } = useConversation();
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const feedbackData = data
    ? data.questions.map((q, idx) => ({
        question: q.question,
        answer: data.answers[idx] || "Answer not provided.",
        suggestions: data.reviews[idx]?.review || "No review available.",
        score: data.reviews[idx]?.score ?? 0,
      }))
    : [
        {
          question: "Sample Question 1",
          answer: "Sample Answer 1",
          suggestions: "Be more clear and provide examples.",
          score: 5,
        },
        {
          question: "Sample Question 2",
          answer: "Sample Answer 2",
          suggestions: "Use a structured format.",
          score: 6,
        },
      ];

  const overallFeedback =
    data?.overAllReview || "No overall feedback available.";
  const totalScore = data?.totalScore ?? 0;

  const participant = data?.participant || {};
  const name = participant.name || "Interview Candidate";
  const email = participant.email || "example@example.com";
  const profilePic =
    participant.profilePicURL ||
    "https://media.istockphoto.com/id/1389348844/photo/studio-shot-of-a-beautiful-young-woman-smiling-while-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=anRTfD_CkOxRdyFtvsiPopOluzKbhBNEQdh4okZImQc=";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "animate__animated",
              "animate__fadeInUp"
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll(".question-review-card");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  // THEME COLORS - Black, white, gray, and #ff6900 only
  const containerBg = darkMode
    ? "bg-black text-white"
    : "bg-white text-gray-900";
  const cardBg = darkMode ? "bg-orange-100" : "bg-orange-50";
  const borderColor = darkMode ? "border-gray-800" : "border-gray-200";
  const accentColor = "text-[#ff6900]";
  const textMuted = darkMode ? "text-gray-800" : "text-gray-600";
  
  // NEW: Improved text contrast variables
  const textPrimary = darkMode ? "text-gray-900" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-800" : "text-gray-700";
  const textInverted = darkMode ? "text-white" : "text-black";

  // Calculate score percentage for visual indicator
  const maxPossibleScore =
    data?.questions?.length * 10 || feedbackData.length * 10;
  const scorePercentage =
    maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

  return (
    <div
      className={`min-h-screen w-full ${containerBg} transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate__animated animate__fadeIn">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#ff6900]">
            Interview Feedback
          </h1>
          <button
            onClick={() => {
              setInterviewModelId("");
              onBack();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-orange-100 hover:bg-orange-500"
                : "bg-orange-50 hover:bg-orange-500"
            } border ${borderColor} transition-all ${textPrimary}`}
          >
            <span className={textPrimary}>←</span>
            <span className={textPrimary}>Back</span>
          </button>
        </div>

        {/* Candidate Info */}
        <div
          className={`flex flex-col md:flex-row items-center gap-6 mb-10 p-6 rounded-xl ${cardBg} border ${borderColor} shadow-sm animate__fadeInUp`}
        >
          <div className="relative">
            <img
              src={profilePic}
              alt={name}
              className="w-24 h-24 object-cover rounded-full border-4 border-[#ff6900]"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#ff6900] flex items-center justify-center text-white">
              <FaUser size={16} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-2xl md:text-3xl font-bold tracking-wide ${textPrimary}`}>
              {name}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <FaEnvelope className="text-[#ff6900]" />
              <p className={`${textSecondary} text-sm`}>{email}</p>
            </div>
          </div>
          <div className="bg-[#ff6900] p-4 rounded-lg text-white text-center">
            <div className="text-3xl font-bold">{totalScore}</div>
            <div className="text-sm">Total Score</div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {[
            {
              label: "Score",
              value: `${totalScore} / ${maxPossibleScore}`,
              icon: <FaStar className="text-[#ff6900]" />,
            },
            {
              label: "Total Questions",
              value: `${data?.questions?.length ?? feedbackData.length}`,
              icon: <FaListAlt className="text-[#ff6900]" />,
            },
            {
              label: "Role",
              value: data?.interviewId?.interview?.role || "N/A",
              icon: <FaUser className="text-[#ff6900]" />,
            },
            {
              label: "Performance",
              value: `${Math.round(scorePercentage)}%`,
              icon: <FaAward className="text-[#ff6900]" />,
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`${cardBg} p-5 rounded-xl border ${borderColor} shadow-sm animate__animated animate__fadeInUp`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-full ${
                    darkMode ? "bg-orange-200" : "bg-white"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-2xl font-semibold text-[#ff6900]">
                  {item.value}
                </span>
              </div>
              <p className={`${textSecondary} text-sm`}>{item.label}</p>
              {item.label === "Performance" && (
                <div className="mt-4 h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff6900]"
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Question Reviews */}
        <div className="mb-12">
          <h3
            className={`${accentColor} text-2xl font-semibold mb-6 animate__animated animate__fadeInUp`}
          >
            Question Reviews
          </h3>

          {feedbackData.map((item, idx) => (
            <div
              key={idx}
              className={`${cardBg} ${borderColor} border rounded-lg p-5 mb-4 transition-all question-review-card`}
            >
              <div
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-orange-200" : "bg-orange-200"
                    } font-bold text-[#ff6900]`}
                  >
                    {item.score}
                  </div>
                  <h4 className={`font-semibold ${textPrimary}`}>
                    Q{idx + 1}. {item.question}
                  </h4>
                </div>
                {openIndex === idx ? (
                  <FaChevronUp className={accentColor} />
                ) : (
                  <FaChevronDown className={textMuted} />
                )}
              </div>

              {openIndex === idx && (
                <div className="mt-4 space-y-4 animate__animated animate__fadeIn">
                  <div
                    className={`${
                      darkMode ? "bg-white" : "bg-white"
                    } rounded-lg p-4 border-l-4 ${darkMode ? "border-gray-700" : "border-gray-400"}`}
                  >
                    <span className={`uppercase text-sm ${textSecondary} font-medium`}>
                      Your Answer
                    </span>
                    <p className={`mt-2 ${textSecondary}`}>{item.answer}</p>
                  </div>
                  <div
                    className={`${
                      darkMode ? "bg-orange-50" : "bg-orange-50"
                    } rounded-lg p-4 border-l-4 border-[#ff6900]`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`uppercase text-sm ${textSecondary} font-medium`}>
                        Feedback
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${
                          darkMode ? "bg-orange-100" : "bg-orange-100"
                        } text-[#ff6900]`}
                      >
                        <FaStar className="mr-1" size={12} />
                        {item.score}/10
                      </span>
                    </div>
                    <p className={`mt-2 ${textSecondary}`}>{item.suggestions}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall Feedback */}
        <div
          className={`${cardBg} ${borderColor} border p-6 rounded-xl mb-10 max-w-4xl mx-auto animate__animated animate__fadeInUp`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 ${
                darkMode ? "bg-orange-200" : "bg-orange-200"
              } rounded-full`}
            >
              <FaAward className="text-[#ff6900]" />
            </div>
            <h4 className="text-xl font-semibold text-[#ff6900]">
              Overall Feedback
            </h4>
          </div>
          <div
            className={`${
              darkMode ? "bg-orange-50" : "bg-white"
            } p-4 rounded-lg`}
          >
            <p className={`leading-relaxed ${textSecondary}`}>{overallFeedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;