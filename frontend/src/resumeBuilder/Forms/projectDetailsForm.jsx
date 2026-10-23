
import React, { useContext } from 'react';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js';
import { ThemeContext } from '../../context/ThemeContext';

function ProjectDetailsForm() {
  const {
    resumeData: { projects },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();
  
  const { theme } = useContext(ThemeContext);

  const emptyProject = {
    title: "",
    description: "",
    github: "",
    liveDemo: ""
  };

  // Theme-aware styles - updated for black dark theme
  const containerStyle = theme === "dark" 
    ? "space-y-4 p-2 flex flex-col h-full bg-black" 
    : "space-y-4 p-2 flex flex-col h-full bg-gray-50";
    
  const headerStyle = theme === "dark" 
    ? "text-xl font-semibold text-white mt-2 border-b border-gray-800 pb-2"
    : "text-xl font-semibold text-gray-800 mt-2 border-b border-gray-300 pb-2";
    
  const cardStyle = theme === "dark" 
    ? "relative border border-gray-800 rounded-lg p-4 space-y-4 bg-black"
    : "relative border border-gray-300 rounded-lg p-4 space-y-4 bg-white";
    
  const inputClass = theme === "dark" 
    ? "w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
  const textareaClass = theme === "dark" 
    ? "w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
    : "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all";
    
  const labelStyle = theme === "dark" 
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";
    
  const buttonStyle = theme === "dark" 
    ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-600 text-white hover:text-white text-sm font-medium transition-all duration-200"
    : "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6900] hover:bg-orange-500 text-white hover:text-white text-sm font-medium transition-all duration-200";
    
  const removeButtonStyle = theme === "dark" 
    ? "absolute top-2 right-2 text-[#ff6900] hover:text-white cursor-pointer"
    : "absolute top-2 right-2 text-[#ff6900] hover:text-gray-800 cursor-pointer";

  return (
    <div className={containerStyle}>

      <div>
        <h2 className={headerStyle}>
          Projects
        </h2>
      </div>

      {projects.map((project, index) => (
        <div
          key={index}
          className={cardStyle}
        >
          {projects.length > 1 && (
            <button
              onClick={() => removeArrayItem('projects', index)}
              className={removeButtonStyle}
              title="Remove this project"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex-1">
            <label htmlFor={`projectTitle-${index}`} className={labelStyle}>
              Project Title
            </label>
            <input
              type="text"
              id={`projectTitle-${index}`}
              className={inputClass}
              placeholder="AIspire"
              value={project.title}
              onChange={(e) => updateArrayItemField('projects', index, 'title', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor={`description-${index}`} className={labelStyle}>
              Description
            </label>
            <textarea
              id={`description-${index}`}
              rows={4}
              className={textareaClass}
              placeholder="Short description about the project"
              value={project.description}
              onChange={(e) => updateArrayItemField('projects', index, 'description', e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={`githubLink-${index}`} className={labelStyle}>
                GitHub Link
              </label>
              <input
                type="text"
                id={`githubLink-${index}`}
                className={inputClass}
                placeholder="https://github.com/username/project"
                value={project.github}
                onChange={(e) => updateArrayItemField('projects', index, 'github', e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`demoUrl-${index}`} className={labelStyle}>
                Live Demo URL
              </label>
              <input
                type="text"
                id={`demoUrl-${index}`}
                className={inputClass}
                placeholder="https://yourwebsite.com"
                value={project.liveDemo}
                onChange={(e) => updateArrayItemField('projects', index, 'liveDemo', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => addArrayItem('projects', emptyProject)}
          className={buttonStyle}
        >
          <span className="text-lg">+</span> Add Project
        </button>
      </div>

    </div>
  );
}

export default ProjectDetailsForm;