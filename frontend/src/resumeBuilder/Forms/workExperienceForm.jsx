
import React, { useContext } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js';
import { ThemeContext } from '../../context/ThemeContext';

function WorkExperienceForm() {
  const {
    resumeData: { workExperience },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const { theme } = useContext(ThemeContext);

  const emptyWorkExperience = {
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: ""
  };

  // Dynamic classes based on theme
  const inputClass = theme === "dark" 
    ? "w-full px-4 py-2.5 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";

  const textareaClass = theme === "dark"
    ? "w-full px-4 py-3 bg-black border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";

  const containerClass = theme === "dark" 
    ? "space-y-4 p-4 flex flex-col h-full bg-black text-white"
    : "space-y-4 p-4 flex flex-col h-full bg-white text-black";

  const sectionClass = theme === "dark"
    ? "relative border border-white rounded-lg p-4 space-y-4 bg-black"
    : "relative border border-gray-300 rounded-lg p-4 space-y-4 bg-white";

  const headingClass = theme === "dark"
    ? "text-xl font-semibold text-white border-b border-white pb-2"
    : "text-xl font-semibold text-black border-b border-gray-300 pb-2";

  const labelClass = theme === "dark"
    ? "block text-sm font-medium text-white mb-1"
    : "block text-sm font-medium text-black mb-1";

  const addButtonClass = theme === "dark"
    ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-white text-white hover:text-black text-sm font-medium transition-all duration-200"
    : "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-gray-800 text-white hover:text-white text-sm font-medium transition-all duration-200";

  return (
    <div className={containerClass}>
      <div>
        <h2 className={headingClass}>
          Work Experience
        </h2>
      </div>

      {workExperience?.map((exp, index) => (
        <div
          key={index}
          className={sectionClass}
        >
          {workExperience.length > 1 && (
            <button
              onClick={() => removeArrayItem('workExperience', index)}
              className="absolute top-2 right-2 text-[#ff6900] hover:text-gray-500 cursor-pointer"
              title="Remove this work experience"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className={labelClass}>Company</label>
              <input
                type="text"
                className={inputClass}
                placeholder="ABC Company"
                value={exp.company}
                onChange={(e) => updateArrayItemField('workExperience', index, 'company', e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className={labelClass}>Role</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Frontend Developer"
                value={exp.role}
                onChange={(e) => updateArrayItemField('workExperience', index, 'role', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                className={inputClass}
                value={exp.startDate}
                onChange={(e) => updateArrayItemField('workExperience', index, 'startDate', e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                className={inputClass}
                value={exp.endDate}
                onChange={(e) => updateArrayItemField('workExperience', index, 'endDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              className={textareaClass}
              placeholder="What did you do in this role?"
              value={exp.description}
              onChange={(e) => updateArrayItemField('workExperience', index, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('workExperience', emptyWorkExperience)}
          className={addButtonClass}
        >
          <span className="text-lg">+</span> Add Work Experience
        </button>
      </div>
    </div>
  );
}

export default WorkExperienceForm;