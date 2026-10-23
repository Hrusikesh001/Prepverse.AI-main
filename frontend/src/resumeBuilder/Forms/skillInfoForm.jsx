







import React, { useContext } from 'react';
import RatingInput from '../ratingInput.jsx';
import { X } from 'lucide-react';
import useResumeStore from '../../stateManage/useResumeStore.js';
import { ThemeContext } from '../../context/ThemeContext';

function SkillInfoForm() {
  const { theme } = useContext(ThemeContext);
  const {
    resumeData: { skills, languages },
    updateArrayItemField,
    addArrayItem,
    removeArrayItem
  } = useResumeStore();

  const emptySkill = {
    name: "",
    category: "programming", // Default category
    progress: 0
  };

  const emptyLanguage = {
    name: "",
    progress: 0
  };

  const handleRatingChangeSkill = (index, newValue) => {
    updateArrayItemField('skills', index, 'progress', newValue);
  };

  const handleRatingChangeLanguages = (index, newValue) => {
    updateArrayItemField('languages', index, 'progress', newValue);
  };

  // Theme-based styling
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-white" : "border-black";
  const placeholderColor = isDark ? "placeholder-white" : "placeholder-black";
  const removeBtnColor = isDark ? "text-white hover:text-orange-500" : "text-black hover:text-orange-500";

  return (
    <div className={`space-y-4 p-4 flex flex-col h-full ${bgColor} ${textColor}`}>
      <div>
        <h2 className={`text-xl font-semibold ${textColor} border-b ${borderColor} pb-2`}>
          Skills & Languages
        </h2>
      </div>

      {/* Skills */}
      {skills.map((skill, index) => (
        <div
          key={index}
          className={`relative border ${borderColor} rounded-lg p-6 space-y-4 ${bgColor}`}
        >
          {skills.length > 1 && (
            <button
              onClick={() => removeArrayItem('skills', index)}
              className={`absolute top-2 right-2 ${removeBtnColor}`}
              title="Remove this skill"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex-1">
              <label htmlFor={`skillCategory-${index}`} className={`block text-sm font-medium ${textColor} mb-1`}>
                Skill Category
              </label>
              <select
                id={`skillCategory-${index}`}
                className={`w-full h-12 px-4 ${bgColor} border ${borderColor} rounded-lg 
                         ${textColor} focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-transparent transition-all`}
                onChange={(e) => {
                  updateArrayItemField('skills', index, 'category', e.target.value);
                }}
                value={skill.category || "programming"}
              >
                <option value="programming">Programming</option>
                <option value="databases">Databases</option>
                <option value="frameworks">Frameworks</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor={`skillName-${index}`} className={`block text-sm font-medium ${textColor} mb-1`}>
                Skill Name
              </label>
              <input
                type="text"
                id={`skillName-${index}`}
                className={`w-full h-12 px-4 ${bgColor} border ${borderColor} rounded-lg 
                         ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-transparent transition-all`}
                placeholder="TypeScript"
                onChange={(e) => {
                  updateArrayItemField('skills', index, 'name', e.target.value);
                }}
                value={skill.name}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`skillRating-${index}`} className={`block text-sm font-medium ${textColor} mb-1`}>
                Rating: {(skill.progress || 0) / 20}/5
              </label>
              <div className="w-full h-12 flex items-center">
                <RatingInput
                  value={skill.progress}
                  onChange={(newValue) => handleRatingChangeSkill(index, newValue)}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200"
          onClick={() => addArrayItem('skills', emptySkill)}
        >
          <span className="text-lg">+</span> Add Skill
        </button>
      </div>

      {/* Languages */}
      {languages.map((language, index) => (
        <div
          key={index}
          className={`relative border ${borderColor} rounded-lg p-6 space-y-4 ${bgColor}`}
        >
          {languages.length > 1 && (
            <button
              onClick={() => removeArrayItem('languages', index)}
              className={`absolute top-2 right-2 ${removeBtnColor}`}
              title="Remove this language"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex-1">
              <label htmlFor={`language-${index}`} className={`block text-sm font-medium ${textColor} mb-1`}>
                Language
              </label>
              <input
                type="text"
                id={`language-${index}`}
                className={`w-full h-12 px-4 ${bgColor} border ${borderColor} rounded-lg 
                         ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-transparent transition-all`}
                placeholder="English"
                onChange={(e) => {
                  updateArrayItemField('languages', index, 'name', e.target.value);
                }}
                value={language.name}
              />
            </div>

            <div className="flex-1">
              <label htmlFor={`languageRating-${index}`} className={`block text-sm font-medium ${textColor} mb-1`}>
                Rating: {(language.progress || 0) / 20}/5
              </label>
              <div className="w-full h-12 flex items-center">
                <RatingInput
                  value={language.progress}
                  onChange={(newValue) => handleRatingChangeLanguages(index, newValue)}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all duration-200"
          onClick={() => addArrayItem('languages', emptyLanguage)}
        >
          <span className="text-lg">+</span> Add Language
        </button>
      </div>
    </div>
  );
}

export default SkillInfoForm;
