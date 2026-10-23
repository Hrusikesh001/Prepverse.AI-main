import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizResult from './QuizResult.jsx';
import useConversation from '../stateManage/useConversation.js';
import { ThemeContext } from '../context/ThemeContext';

const QuizInterface = ({ config }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const { theme } = useContext(ThemeContext);

  const { quizData } = useConversation();
  const sampleQuestions = quizData;
  const questions = sampleQuestions.slice(0, config.count);

  const handleOptionClick = (option) => {
    setSelected(option);
  };

  const next = () => {
    const currentQ = questions[current];
    const isCorrect = selected === currentQ.answer;

    setAnswers((prev) => [...prev, selected]);
    if (isCorrect) setCorrect((prev) => prev + 1);

    setSelected(null);

    if (current === questions.length - 1) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
    }
  };

  // Theme-based styles
  const containerBg = theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-gray-100';
  const cardBg = theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50';
  const cardBorder = theme === 'dark' ? 'border-orange-200' : 'border-orange-100';
  const textPrimary = theme === 'dark' ? 'text-gray-900' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-700' : 'text-gray-600';
  const progressBg = theme === 'dark' ? 'bg-orange-200' : 'bg-orange-200';
  const optionBg = theme === 'dark' ? 'bg-white' : 'bg-white';
  const optionHover = theme === 'dark' ? 'hover:bg-orange-50' : 'hover:bg-orange-100';
  const optionBorder = theme === 'dark' ? 'border-orange-200' : 'border-orange-100';
  const disabledButton = theme === 'dark' ? 'bg-gray-300 text-gray-500' : 'bg-gray-300 text-gray-500';

  return (
    <div className={`min-h-screen w-screen ${containerBg} flex items-center justify-center p-6 transition-colors duration-300`}>
      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl"
          >
            <QuizResult
              score={correct}
              total={questions.length}
              name={config.name}
              subject={config.subject}
              level={config.level}
              restartQuiz={() => {
                setShowResult(false);
                setCurrent(0);
                setCorrect(0);
                setAnswers([]);
                setSelected(null);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`question-${current}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className={`${cardBg} ${textPrimary} p-8 rounded-2xl shadow-lg w-full max-w-3xl space-y-8 border-2 ${cardBorder} 
                        transition-all duration-300 relative group
                        before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
                        before:transition-all before:duration-300
                        hover:before:shadow-[0_0_15px_5px_rgba(255,105,0,0.4)] hover:border-orange-300`}
          >
            {/* Progress */}
            <div className="flex justify-between items-center">
              <h2 className={`text-lg font-semibold ${textSecondary}`}>
                Question {current + 1} of {questions.length}
              </h2>
              <div className={`w-32 h-2 ${progressBg} rounded-full overflow-hidden`}>
                <div
                  className="h-full bg-[#ff6900] transition-all duration-500"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {questions[current].question}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {questions[current].options.map((opt, idx) => {
                const label = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selected === opt;
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOptionClick(opt)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all text-left font-medium border
                      ${
                        isSelected
                          ? 'bg-[#ff6900] text-white border-[#ff6900] shadow-lg'
                          : `${optionBg} ${textPrimary} ${optionBorder} ${optionHover} hover:shadow-md`
                      }`}
                  >
                    <span
                      className={`uppercase font-bold w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-white text-[#ff6900]' : (theme === 'dark' ? 'bg-orange-200 text-gray-900' : 'bg-orange-100 text-gray-900')
                      }`}
                    >
                      {label}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <button
                onClick={next}
                disabled={selected === null}
                className={`px-8 py-3 rounded-lg font-semibold transition-all text-lg
                  ${
                    selected
                      ? 'bg-[#ff6900] text-white hover:bg-[#e85f00] shadow-md hover:shadow-lg'
                      : `${disabledButton}`
                  }`}
              >
                {current === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizInterface;