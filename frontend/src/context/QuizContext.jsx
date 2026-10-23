// src/context/QuizContext.jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Create the context
const QuizContext = createContext();

// 2. Create the provider
export const QuizProvider = ({ children }) => {
  const [config, setConfig] = useState(null); // Stores quiz config data

  return (
    <QuizContext.Provider value={{ config, setConfig }}>
      {children}
    </QuizContext.Provider>
  );
};

// 3. Custom hook for easy access
export const useQuiz = () => useContext(QuizContext);
