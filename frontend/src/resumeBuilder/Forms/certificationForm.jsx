
import React, { useContext } from 'react'; 
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js';
import { ThemeContext } from '../../context/ThemeContext';

function CertificationForm() {
  const {
    resumeData: { certifications },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();
  
  const { theme } = useContext(ThemeContext);

  const emptyCertification = {
    title: "",
    issuer: "",
    year: "",
    link: ""
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

  const removeButtonStyle = theme === "dark"
    ? "absolute top-2 right-2 text-[#ff6900] hover:text-gray-300 cursor-pointer"
    : "absolute top-2 right-2 text-[#ff6900] hover:text-gray-600 cursor-pointer";

  const addButtonStyle = theme === "dark"
    ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200"
    : "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200";

  return (
    <div className={containerStyle}>
      <div>
        <h2 className={headerStyle}>
          Certification
        </h2>
      </div>

      {certifications.map((certification, index) => (
        <div
          key={index}
          className={cardStyle}
        >
          {certifications.length > 1 && (
            <button
              onClick={() => removeArrayItem('certifications', index)}
              className={removeButtonStyle}
              title="Remove this certification"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex-1">
            <label htmlFor={`title-${index}`} className={labelStyle}>
              Title
            </label>
            <input
              type="text"
              id={`title-${index}`}
              className={inputStyle}
              placeholder="React Developer Certificate"
              onChange={(e) => {
                updateArrayItemField('certifications', index, 'title', e.target.value);
              }}
              value={certification.title}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`issuer-${index}`} className={labelStyle}>
                Issuer
              </label>
              <input
                type="text"
                id={`issuer-${index}`}
                className={inputStyle}
                placeholder="Coursera"
                onChange={(e) => {
                  updateArrayItemField('certifications', index, 'issuer', e.target.value);
                }}
                value={certification.issuer}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`year-${index}`} className={labelStyle}>
                Issue Date
              </label>
              <input
                type="date"
                id={`year-${index}`}
                className={inputStyle}
                onChange={(e) => {
                  updateArrayItemField('certifications', index, 'year', e.target.value);
                }}
                value={certification.year}
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor={`link-${index}`} className={labelStyle}>
              Certificate Link (Optional)
            </label>
            <input
              type="url"
              id={`link-${index}`}
              className={inputStyle}
              placeholder="https://example.com/certificate"
              onChange={(e) => {
                updateArrayItemField('certifications', index, 'link', e.target.value);
              }}
              value={certification.link}
            />
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('certifications', emptyCertification)}
          className={addButtonStyle}
        >
          <span className="text-lg">+</span> Add Certification
        </button>
      </div>
    </div>
  );
}

export default CertificationForm;