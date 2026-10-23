

import React, { useContext } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js';
import { ThemeContext } from '../../context/ThemeContext';

function EducationForm() {
  const {
    resumeData: { education },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();
  
  const { theme } = useContext(ThemeContext);

  const emptyEducation = {
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    cgpa: ""
  }

  // Theme-specific styles with true black for dark theme
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
    ? "w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
  const labelStyle = theme === "dark" 
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";
    
  const buttonStyle = theme === "dark" 
    ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200"
    : "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-500 text-white text-sm font-medium transition-all duration-200";

  const removeButtonStyle = theme === "dark"
    ? "absolute top-2 right-2 text-[#ff6900] hover:text-gray-300 cursor-pointer"
    : "absolute top-2 right-2 text-[#ff6900] hover:text-gray-600 cursor-pointer";

  return (
    <div className={containerStyle}>

      <div>
        <h2 className={headerStyle}>
          Education
        </h2>
      </div>

      {education.map((edu, index) => (
        <div
          key={index}
          className={cardStyle}
        >
          {education.length > 1 && (
            <button
              onClick={() => removeArrayItem('education', index)}
              className={removeButtonStyle}
              title="Remove this education"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`degree-${index}`} className={labelStyle}>
                Degree
              </label>
              <input
                type="text"
                id={`degree-${index}`}
                className={inputStyle}
                placeholder="B.Tech in Computer Science"
                onChange={(e) => updateArrayItemField('education', index, 'degree', e.target.value)}
                value={edu.degree}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`institution-${index}`} className={labelStyle}>
                Institution
              </label>
              <input
                type="text"
                id={`institution-${index}`}
                className={inputStyle}
                placeholder="IIT Delhi"
                onChange={(e) => updateArrayItemField('education', index, 'institution', e.target.value)}
                value={edu.institution}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`startDate-${index}`} className={labelStyle}>
                Start Date
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                className={inputStyle}
                onChange={(e) => updateArrayItemField('education', index, 'startDate', e.target.value)}
                value={edu.startDate}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`endDate-${index}`} className={labelStyle}>
                End Date
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                className={inputStyle}
                onChange={(e) => updateArrayItemField('education', index, 'endDate', e.target.value)}
                value={edu.endDate}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`cgpa-${index}`} className={labelStyle}>
                CGPA
              </label>
              <input
                type="text"
                id={`cgpa-${index}`}
                className={inputStyle}
                placeholder="8.5/10 or 3.7/4.0"
                onChange={(e) => updateArrayItemField('education', index, 'cgpa', e.target.value)}
                value={edu.cgpa}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('education', emptyEducation)}
          className={buttonStyle}
        >
          <span className="text-lg">+</span> Add Education
        </button>
      </div>
    </div>
  );
}

export default EducationForm;