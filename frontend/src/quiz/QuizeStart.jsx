import React from 'react';
import { useQuiz } from '../context/QuizContext.jsx';
import QuizInterface from './QuizInterface.jsx';

const QuizStart = () => {
  const { config } = useQuiz();

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-red-700">
        <p>No quiz config found. Please go back and start the quiz again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#240046] to-[#5a189a] text-white flex items-center justify-center">
      <QuizInterface config={config} />
    </div>
  );
};

export default QuizStart;
