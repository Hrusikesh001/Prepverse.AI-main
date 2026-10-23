
import React, { useContext } from 'react';
import useResumeStore from '../../stateManage/useResumeStore';
import { ThemeContext } from '../../context/ThemeContext';

function ContactInfoForm() {
  const { resumeData, updateResumeField } = useResumeStore();
  const { theme } = useContext(ThemeContext);

  // Theme-specific styles with true black for dark theme
  const containerStyle = theme === "dark" 
    ? "space-y-6 p-2 flex flex-col justify-evenly h-full bg-black"
    : "space-y-6 p-2 flex flex-col justify-evenly h-full bg-gray-50";
    
  const headerStyle = theme === "dark" 
    ? "text-xl font-semibold text-white mt-2 border-b border-gray-800 pb-2"
    : "text-xl font-semibold text-gray-800 mt-2 border-b border-gray-300 pb-2";
    
  const inputStyle = theme === "dark" 
    ? "w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
  const labelStyle = theme === "dark" 
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className={containerStyle}>

      <div>
        <h2 className={headerStyle}>
          Contact Information
        </h2>
      </div>

      <div className="flex-1">
        <label htmlFor="location" className={labelStyle}>
          Address
        </label>
        <input
          type="text"
          id="location"
          className={inputStyle}
          placeholder="Short Address"
          value={resumeData.contactInfo?.location || ''}
          onChange={(e) => updateResumeField('contactInfo', 'location', e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="email" className={labelStyle}>
            Email
          </label>
          <input
            type="text"
            id="email"
            className={inputStyle}
            placeholder="John@gmail.com"
            value={resumeData.contactInfo?.email || ''}
            onChange={(e) => updateResumeField('contactInfo', 'email', e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="phone" className={labelStyle}>
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            className={inputStyle}
            placeholder="9078343277"
            value={resumeData.contactInfo?.phone || ''}
            onChange={(e) => updateResumeField('contactInfo', 'phone', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="linkedin" className={labelStyle}>
            LinkedIn
          </label>
          <input
            type="text"
            id="linkedin"
            className={inputStyle}
            placeholder="https://linkedin.com/in/username"
            value={resumeData.contactInfo?.linkedin || ''}
            onChange={(e) => updateResumeField('contactInfo', 'linkedin', e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="github" className={labelStyle}>
            GitHub
          </label>
          <input
            type="text"
            id="github"
            className={inputStyle}
            placeholder="https://github.com/username"
            value={resumeData.contactInfo?.github || ''}
            onChange={(e) => updateResumeField('contactInfo', 'github', e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1">
        <label htmlFor="website" className={labelStyle}>
          Portfolio / Website
        </label>
        <input
          type="text"
          id="website"
          className={inputStyle}
          placeholder="https://yourwebsite.com"
          value={resumeData.contactInfo?.website || ''}
          onChange={(e) => updateResumeField('contactInfo', 'website', e.target.value)}
        />
      </div>

    </div>
  );
}

export default ContactInfoForm;