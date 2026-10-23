
import React, { useContext } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js';
import { ThemeContext } from '../../context/ThemeContext';

function InterestForm() {
  const {
    resumeData: { interest },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();
  
  const { theme } = useContext(ThemeContext);

  const emptyInterest = {
    name: ""
  };

  // Theme-specific styles
  const containerStyle = theme === "dark" 
    ? "space-y-4 p-2 flex flex-col h-full bg-black" 
    : "space-y-4 p-2 flex flex-col h-full bg-gray-50";
    
  const headerStyle = theme === "dark" 
    ? "text-xl font-semibold text-white mt-2 border-b border-gray-800 pb-2"
    : "text-xl font-semibold text-gray-800 mt-2 border-b border-gray-300 pb-2";
    
  const cardStyle = theme === "dark" 
    ? "border border-gray-800 rounded-lg p-4 space-y-4 bg-black relative"
    : "border border-gray-300 rounded-lg p-4 space-y-4 bg-white relative";
    
  const inputStyle = theme === "dark" 
    ? "w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
  const labelStyle = theme === "dark" 
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";
    
  const buttonStyle = theme === "dark" 
    ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-600 text-white hover:text-white text-sm font-medium transition-all duration-200"
    : "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-500 text-white hover:text-white text-sm font-medium transition-all duration-200";

  return (
    <div className={containerStyle}>

      <div>
        <h2 className={headerStyle}>
          Interest
        </h2>
      </div>

      {interest.map((data, index) => (
        <div
          key={index}
          className={cardStyle}
        >
          {interest.length > 1 && (
            <button
              onClick={() => removeArrayItem('interest', index)}
              className="absolute top-2 right-2 text-[#ff6900] hover:text-white cursor-pointer"
              title="Remove this interest"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex-1">
            <label htmlFor={`interest-${index}`} className={labelStyle}>
              Interest
            </label>
            <input
              type="text"
              id={`interest-${index}`}
              className={inputStyle}
              placeholder="React Developer"
              value={data.name}
              onChange={(e) => updateArrayItemField('interest', index, 'name', e.target.value)}
            />
          </div>

        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('interest', emptyInterest)}
          className={buttonStyle}
        >
          <span className="text-lg">+</span> Add Interest
        </button>
      </div>

    </div>
  );
}

export default InterestForm;