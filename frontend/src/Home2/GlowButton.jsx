import React, { useState } from 'react';

const GLowButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <button
        className="relative group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Animated circles */}
        <div className={`absolute inset-0 rounded-full bg-white opacity-10 ${isHovered ? 'animate-ping' : ''}`}></div>
        
        {/* Main content */}
        <div className="relative flex items-center justify-center space-x-2">
          <span className="text-white font-bold text-lg tracking-wide">Get Started Now</span>
          <svg 
            className={`w-5 h-5 text-white transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        
        {/* Border glow effect */}
        <div className="absolute -inset-2 rounded-full bg-amber-400 opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300"></div>
      </button>
    </div>
  );
};

export default GLowButton;