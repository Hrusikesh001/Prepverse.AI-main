import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from '../context/AuthProvider.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import server from "../environment.js";

function ProfilePage() {
  const { authUser, setAuthUser } = useAuth();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [resumeLink, setResumeLink] = useState(authUser.user.resumeLink || "");
  const [resumeSummary, setResumeSummary] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeDetails, setResumeDetails] = useState({
    skills: [],
    projects: [],
    education: [],
    experience: []
  });
  const [mobileNumber, setMobileNumber] = useState(authUser.user.mobileNumber || "");
  const [isUpdatingMobile, setIsUpdatingMobile] = useState(false);

  useEffect(() => {
    const getResumeData = async () => {
      try {
        const { data } = await axios.post(
          `${server}/resume-upload/getResumeData`,
          {},
          { withCredentials: true }
        );

if (data.resume_data) {
  setResumeLink(data.resume_data.resumeLink || "");
  setResumeSummary(data.resume_data.resumeReview || "");

  const resumeJSON = data.resume_data.resumeJSONdata || {};

  const filteredData = {
    skills: resumeJSON.skills || [],
    projects: resumeJSON.projects || [],
    education: resumeJSON.education || [],
    experience: resumeJSON.experience || []
  };

  setResumeDetails(filteredData);
}
      } catch (err) {
        console.log(err);
      }
    }

    getResumeData();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      toast.error("Please select a PDF, DOC, or DOCX file");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return toast.error("Please select a resume file first!");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const { data } = await axios.post(
        `${server}/resume-upload/upload`,
        formData,
        {
          withCredentials: true,
        }
      );

if (data.newResume) {
  setResumeLink(data.newResume.resumeLink || "");
  setResumeSummary(data.newResume.resumeReview || "");

  const resumeJSON = data.newResume.resumeJSONdata || {};

  const filteredData = {
    skills: resumeJSON.skills || [],
    projects: resumeJSON.projects || [],
    education: resumeJSON.education || [],
    experience: resumeJSON.experience || []
  };

  setResumeDetails(filteredData);

  toast.success("Resume uploaded successfully!");
  setSelectedFile(null);
}

    } catch (err) {
      console.error(err);
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!resumeLink) return;

    try {
      const { data } = await axios.delete(
        `${server}/resume-upload/delete`,
        { withCredentials: true }
      );

      if (data.success) {
        setResumeLink("");
        setResumeSummary("");
        setResumeDetails({
          skills: [],
          projects: [],
          education: [],
          experience: []
        });
        toast.success("Resume deleted successfully!");
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleMobileNumberUpdate = async () => {
    if (!mobileNumber.trim()) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsUpdatingMobile(true);
    try {
      const { data } = await axios.post(
        `${server}/user/update-mobile`,
        { mobileNumber },
        { withCredentials: true }
      );

      if (!data.user) {
        return toast.error("Mobile number updation Failed!");
      }

      toast.success(data.message);

      localStorage.setItem("authUserData", JSON.stringify(data));
      setAuthUser({
        ...authUser,
        user: data.user
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to update mobile number");
    } finally {
      setIsUpdatingMobile(false);
    }
  };

  const handleDeleteMobileNumber = async () => {
    setIsUpdatingMobile(true);
    try {
      const { data } = await axios.post(
        `${server}/user/delete-mobile`,
        {},
        { withCredentials: true }
      );

      if (!data.user) {
        return toast.error("Mobile number updation Failed!");
      }

      toast.success(data.message);

      localStorage.setItem("authUserData", JSON.stringify(data));
      setAuthUser({
        ...authUser,
        user: data.user
      });
      setMobileNumber("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove mobile number");
    } finally {
      setIsUpdatingMobile(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
  };

  const navigateToResumeBuilder = () => {
    navigate("/resume-builder");
  };

  const renderSkills = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return null;

    const validSkills = skills.filter(skillCategory =>
      skillCategory &&
      skillCategory.name &&
      skillCategory.items &&
      Array.isArray(skillCategory.items) &&
      skillCategory.items.length > 0
    );

    if (validSkills.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'} mb-3`}>Skills</h3>
        {validSkills.map((skillCategory, index) => (
          <div key={index} className="mb-3">
            <h4 className="text-md font-semibold text-orange-500 capitalize">
              {skillCategory.name}:
            </h4>
            <p className={theme === 'dark' ? 'text-black' : 'text-gray-600'}>{skillCategory.items.join(', ')}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = (education) => {
    if (!education || !Array.isArray(education) || education.length === 0) return null;

    const validEducation = education.filter(edu =>
      edu && (
        (edu.degree && edu.degree.trim() !== '') ||
        (edu.field_of_study && edu.field_of_study.trim() !== '') ||
        (edu.institution && edu.institution.trim() !== '') ||
        (edu.graduation_year && edu.graduation_year.trim() !== '')
      )
    );

    if (validEducation.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'} mb-3`}>Education</h3>
        {validEducation.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50'}`}
          >
            {edu?.degree && <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'}`}>{edu.degree}</h4>}
            {edu?.field_of_study && <p className={theme === 'dark' ? 'text-black' : 'text-gray-600'}>{edu.field_of_study}</p>}
            {edu?.institution && <p className={theme === 'dark' ? 'text-black' : 'text-gray-600'}>{edu.institution}</p>}
            {edu?.graduation_year && <p className={`text-sm ${theme === 'dark' ? 'text-black' : 'text-gray-500'}`}>{edu.graduation_year}</p>}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderExperience = (experience) => {
    if (!experience || !Array.isArray(experience) || experience.length === 0) return null;

    const validExperience = experience.filter(exp =>
      exp && (
        (exp.organization && exp.organization.trim() !== '') ||
        (exp.role && exp.role.trim() !== '') ||
        (exp.duration && exp.duration.trim() !== '') ||
        (exp.skills_used && Array.isArray(exp.skills_used) && exp.skills_used.length > 0) ||
        (exp.responsibilities && Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0)
      )
    );

    if (validExperience.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'} mb-3`}>Experience</h3>
        {validExperience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50'}`}
          >
            {exp?.organization && <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'}`}>{exp.organization}</h4>}
            {exp?.role && <p className={theme === 'dark' ? 'text-black' : 'text-gray-600'}>{exp.role}</p>}
            {exp?.duration && <p className={`text-sm ${theme === 'dark' ? 'text-black' : 'text-gray-500'}`}>{exp.duration}</p>}
            {exp?.skills_used && Array.isArray(exp.skills_used) && exp.skills_used.length > 0 && (
              <p className={`text-sm ${theme === 'dark' ? 'text-black' : 'text-gray-500'}`}>Skills used: {exp.skills_used.join(', ')}</p>
            )}
            {exp?.responsibilities && Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
              <div className="mt-2">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-black' : 'text-gray-600'}`}>Responsibilities:</p>
                <ul className={`text-sm list-disc list-inside ${theme === 'dark' ? 'text-black' : 'text-gray-500'}`}>
                  {exp.responsibilities.map((responsibility, i) => (
                    <li key={i}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProjects = (projects) => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) return null;

    const validProjects = projects.filter(project =>
      project && (
        (project.name && project.name.trim() !== '') ||
        (project.role && project.role.trim() !== '') ||
        (project.description && project.description.trim() !== '') ||
        (project.skills_used && Array.isArray(project.skills_used) && project.skills_used.length > 0) ||
        (project.link && project.link.trim() !== '')
      )
    );

    if (validProjects.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'} mb-3`}>Projects</h3>
        {validProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
            className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50'}`}
          >
            {project?.name && <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-black' : 'text-gray-800'}`}>{project.name}</h4>}
            {project?.role && <p className={theme === 'dark' ? 'text-black' : 'text-gray-600'}>Role: {project.role}</p>}
            {project?.description && <p className={theme === 'dark' ? 'text-black' : 'text-gray-600'}>{project.description}</p>}
            {project?.skills_used && Array.isArray(project.skills_used) && project.skills_used.length > 0 && (
              <p className={`text-sm ${theme === 'dark' ? 'text-black' : 'text-gray-500'}`}>Skills used: {project.skills_used.join(', ')}</p>
            )}
            {project?.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
              >
                View Project
              </a>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Render Markdown-style sections produced by generate_user_summary().
  const renderResumeSummary = (summary) => {
    if (!summary || !summary.trim()) return null;

    const sections = summary
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        let title = 'Professional Overview';
        let bodyLines = lines;

        if (lines.length > 0 && /^#{1,6}\s+/.test(lines[0])) {
          title = lines[0].replace(/^#{1,6}\s+/, '').trim();
          bodyLines = lines.slice(1);
        } else if (lines.length > 0 && lines[0].endsWith(':')) {
          title = lines[0].slice(0, -1).trim();
          bodyLines = lines.slice(1);
        }

        const items = bodyLines
          .map((line) => line.replace(/^[-*]\s+/, '').trim())
          .filter(Boolean);

        return { title, items, body: items.join('\n') };
      });

    const renderItem = (item, itemIndex) => {
      const match = item.match(/^\*\*(.+?):\*\*\s*(.*)$/);
      if (match) {
        return (
          <li key={`${match[1]}-${itemIndex}`}>
            <span className="font-semibold text-gray-800">{match[1]}:</span>{' '}
            {match[2].replace(/\*\*/g, '')}
          </li>
        );
      }
      return <li key={`${item.slice(0, 40)}-${itemIndex}`}>{item.replace(/\*\*/g, '').replace(/[.]$/, '')}</li>;
    };

    return (
      <section className="mb-8 rounded-xl border border-orange-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-xl font-bold text-orange-600">
          Professional Resume Summary
        </h3>
        <div className="space-y-5">
          {sections.map((section, index) => {
            const isKeywords = /technical keywords for matching/i.test(section.title);
            const keywords = isKeywords
              ? section.items.join(', ').split(/[,;]\s*/).map((item) => item.trim()).filter(Boolean)
              : [];

            return (
              <div key={`${section.title}-${index}`}>
                <h4 className="mb-2 text-base font-semibold text-gray-800">
                  {section.title}
                </h4>
                {isKeywords ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, keywordIndex) => (
                      <span key={`${keyword}-${keywordIndex}`} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                        {keyword.replace(/[.]$/, '')}
                      </span>
                    ))}
                  </div>
                ) : section.items.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700">
                    {section.items.map(renderItem)}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const hasResumeData = () => {
    const { skills, projects, education, experience } = resumeDetails;

    const hasSkills = skills && skills.length > 0 && skills.some(skillCategory =>
      skillCategory.items && skillCategory.items.length > 0
    );

    const hasProjects = projects && projects.length > 0;
    const hasEducation = education && education.length > 0;
    const hasExperience = experience && experience.length > 0;

    return hasSkills || hasProjects || hasEducation || hasExperience || Boolean(resumeSummary.trim());
  };

  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'} text-white overflow-x-hidden p-4 md:p-8`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-4xl mx-auto rounded-xl ${theme === 'dark' ? 'bg-orange-100 border-gray-700' : 'bg-orange-50 border-gray-200'} border mt-8 md:mt-16 p-6 md:p-8 shadow-xl`}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <div className="relative">
              <img
                src={authUser.user.profilePicURL}
                alt="User"
                className="h-32 w-32 rounded-full object-cover border-4 border-orange-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:ml-8 text-center md:text-left">
            <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-black' : 'text-gray-800'}`}>
              {authUser.user.name}
            </h1>
            <p className={`${theme === 'dark' ? 'text-black' : 'text-gray-600'} mt-1`}>@{authUser.user.username}</p>
            <p className={`${theme === 'dark' ? 'text-black' : 'text-gray-600'} flex items-center mt-1`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {authUser.user.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {resumeLink ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(resumeLink, '_blank')}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-medium transition-colors shadow-md"
                  >
                    <span>View Resume</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteResume}
                    className={`inline-flex items-center px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-black font-medium transition-colors shadow-md`}
                  >
                    <span>Delete Resume</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </>
              ) : (
                <p className="text-orange-500 flex items-center justify-center md:justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  No resume uploaded
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Number Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`max-w-4xl mx-auto mt-6 rounded-xl ${theme === 'dark' ? 'bg-orange-100 border-gray-700' : 'bg-orange-50 border-gray-200'} border p-6 shadow-xl`}
      >
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-black' : 'text-gray-800'} mb-4`}>Contact Information</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="mobileNumber" className={`block text-sm font-medium ${theme === 'dark' ? 'text-black' : 'text-gray-600'} mb-1`}>
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              disabled={authUser.user.mobileNumber}
              className={`w-full px-4 py-2 ${theme === 'dark' ? 'bg-white border-orange-100 text-black' : 'bg-white border-gray-300 text-gray-800'} border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-70`}
            />
          </div>

          {authUser.user.mobileNumber ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeleteMobileNumber}
              disabled={isUpdatingMobile}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 mt-2 md:mt-6"
            >
              {isUpdatingMobile ? "Removing..." : "Remove"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMobileNumberUpdate}
              disabled={isUpdatingMobile || !mobileNumber.trim()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 mt-2 md:mt-6"
            >
              {isUpdatingMobile ? "Saving..." : "Save Number"}
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto mt-6 mb-12"
      >
        {!resumeLink ? (
          <div className={`${theme === 'dark' ? 'bg-orange-100 border-gray-700' : 'bg-orange-50 border-gray-200'} border rounded-xl p-6 text-center shadow-lg`}>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-500/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-orange-500 mb-2">Complete Your Profile</h3>
            <p className={`${theme === 'dark' ? 'text-black' : 'text-gray-600'} mb-4`}>
              Upload your resume to complete your profile and unlock all features.
            </p>
            
            <div className="mb-6 p-4 rounded-lg bg-black/10">
              <p className={`${theme === 'dark' ? 'text-black' : 'text-gray-600'} mb-2`}>
                Don't have a resume? We've got you covered!
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={navigateToResumeBuilder}
                className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-md"
              >
                <span>Build Your Resume</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>

            {!selectedFile ? (
              <motion.label
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-6 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium cursor-pointer transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Select Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.label>
            ) : (
              <div className="flex flex-col items-center">
                <p className={`${theme === 'dark' ? 'text-black' : 'text-gray-600'} mb-4`}>Selected file: {selectedFile.name}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-black font-medium transition-colors disabled:opacity-50 shadow-md"
                  >
                    {isUploading ? "Uploading..." : "Upload Resume"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelUpload}
                    className={`inline-flex items-center px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-black font-medium transition-colors shadow-md`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-black' : 'text-gray-500'}`}>Supported formats: PDF, DOC, DOCX</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-black' : 'text-gray-800'} mb-4 md:mb-0`}>
                Resume Details
              </h2>

              <motion.label
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-orange-100 border-gray-600' : 'bg-orange-500 border-gray-300'} border text-gray-200 text-sm cursor-pointer hover:bg-gray-600 transition-colors shadow-md`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.380-8.379-2.83-2.828z" />
                </svg>
                Update Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.label>
            </div>

            {selectedFile && (
              <div className={`mb-4 p-4 rounded-lg flex items-center justify-between shadow-md ${theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50'}`}>
                <p className={theme === 'dark' ? 'text-black' : 'text-black-600'}>Selected file: {selectedFile.name}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded text-sm disabled:opacity-50 shadow-md"
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelUpload}
                    className={`px-3 py-1 ${theme === 'dark' ? 'bg-black hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded text-sm shadow-md`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}

            {hasResumeData() ? (
              <div className={`${theme === 'dark' ? 'bg-orange-100 border-gray-700' : 'bg-orange-50 border-gray-200'} border rounded-xl p-6 shadow-lg`}>
                {renderResumeSummary(resumeSummary)}
                {renderEducation(resumeDetails.education)}
                {renderExperience(resumeDetails.experience)}
                {renderSkills(resumeDetails.skills)}
                {renderProjects(resumeDetails.projects)}

                <div className={`mt-8 p-4 rounded-lg border ${theme === 'dark' ? 'bg-orange-700/50 border-gray-600' : 'bg-orange-100/50 border-gray-300'}`}>
                  <p className={`text-sm italic ${theme === 'dark' ? 'text-black' : 'text-black-600'}`}>
                    These are the important details extracted from your resume. Other information like certifications,
                    publications, and open source contributions have also been parsed and stored in our database.
                  </p>
                </div>
              </div>
            ) : (
              <div className={`${theme === 'dark' ? 'bg-orange-100 border-gray-700' : 'bg-orange-50 border-gray-200'} border rounded-xl p-6 text-center shadow-lg`}>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-orange-500 mb-2">Resume Uploaded</h3>
                <p className={theme === 'dark' ? 'text-black' : 'text-black-600'}>
                  Your resume has been uploaded successfully, but no structured data could be extracted.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProfilePage;