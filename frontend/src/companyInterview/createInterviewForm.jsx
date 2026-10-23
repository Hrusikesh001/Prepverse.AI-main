import React, { useState, useContext } from "react";
import { X, Loader } from "lucide-react";
import axios from 'axios';
import server from '../environment.js';
import { toast } from 'react-hot-toast';
import { ThemeContext } from '../context/ThemeContext';

function CreateInterviewForm() {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobRole: "",
    jobTopic: "",
    duration: "",
    type: "",
    company: "",
    stipend: "",
    jobType: "",
    lastDate: "",
    description: "",
    numOfQns: 2,
    location: ""
  });

  const [topics, setTopics] = useState([""]);

  const handleAddTopic = () => {
    setTopics([...topics, ""]);
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
  };

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = value;
    setTopics(updatedTopics);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.jobRole || !formData.numOfQns || topics.length === 0) return;

    setIsLoading(true);

    try {
      const topicsString = topics.join(", ");

      await axios.post(
        `${server}/interview/create-companyInterview`,
        {
          ...formData,
          jobTopic: topicsString
        },
        { withCredentials: true }
      );

      setFormData({
        jobTitle: "",
        jobRole: "",
        jobTopic: "",
        duration: "",
        type: "",
        company: "",
        stipend: "",
        jobType: "",
        lastDate: "",
        description: "",
        numOfQns: 2,
        location: "",
      });
      setTopics([""]);
      toast.success("Interview Created");
    } catch (err) {
      console.log(err);
      const errorMessage = err?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center px-4 py-8 ${theme === "dark" ? "bg-black" : "bg-gray-50"
        } min-h-[100vh] w-full`}
    >
      <form
        onSubmit={handleSubmit}
        className={`relative max-w-4xl p-6 rounded-2xl shadow-lg w-full ${theme === "dark"
            ? "bg-orange-100 border border-gray-700 text-gray-900"
            : "bg-orange-50 border border-gray-300 text-gray-900"
          }`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-6 ${theme === "dark" ? "text-[#ff6900]" : "text-[#ff6900]"
            }`}
        >
          Create Your Custom AI Interview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Job Title Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="e.g., Senior Frontend Developer"
              className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
              required
            />
          </div>

          {/* Job Role Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Job Role</label>
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleInputChange}
              placeholder="e.g., Frontend Developer"
              className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
              required
            />
          </div>

          {/* Company Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
            />
          </div>

          {/* Duration Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 3 months, Full-time"
              className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
            />
          </div>

          {/* Type Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Internship Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
            >
              <option value="">Select type</option>
              <option value="Short Term">Short Term</option>
              <option value="Long Term">Long Term</option>
              <option value="Converting">Converting</option>
              <option value="Summer">Summer</option>
              <option value="Semester">Semester</option>
              <option value="Research">Research</option>
            </select>
          </div>

          {/* Job Type Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
            >
              <option value="">Select job type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Stipend Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Stipend/Salary</label>
            <input
              type="text"
              name="stipend"
              value={formData.stipend}
              onChange={handleInputChange}
              placeholder="e.g., $50,000 - $70,000"
              className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                }`}
            />
          </div>

          {/* Last Date Input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Last Date to Apply</label>
            <input
              type="date"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme === "dark"
                  ? "bg-white border-gray-300 text-black focus:ring-[#ff6900] [color-scheme:light]"
                  : "bg-white border-gray-300 text-black focus:ring-[#ff6900] [color-scheme:light]"
                }`}
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Vijayawada, Andhra Pradesh, India"
            className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
              }`}
          />
        </div>

        {/* Number of Questions */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium">Number of Questions</label>
          <input
            type="number"
            name="numOfQns"
            min={2}
            max={25}
            value={formData.numOfQns}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
              }`}
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter job description"
            rows="3"
            className={`w-full px-3 py-2 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
              }`}
          />
        </div>



        {/* Topics */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Internship Topics</label>
          {topics.map((topic, index) => (
            <div key={index} className="relative mb-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                placeholder={`Topic ${index + 1}`}
                className={`w-full px-3 py-2 pr-10 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 ${theme === "dark"
                    ? "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                    : "bg-white border-gray-300 text-black focus:ring-[#ff6900]"
                  }`}
                required
              />
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTopic}
            className={`text-sm mt-2 px-3 py-1 rounded-md border transition ${theme === "dark"
                ? "border-[#ff6900] text-[#ff6900] hover:bg-[#ff6900]/20"
                : "border-[#ff6900] text-[#ff6900] hover:bg-[#ff6900]/20"
              }`}
          >
            + Add New Topic
          </button>
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg font-semibold transition duration-200 flex items-center justify-center ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : theme === "dark"
                ? "bg-[#ff6900] text-white hover:bg-[#ff7f33]"
                : "bg-[#ff6900] text-white hover:bg-[#ff7f33]"
            }`}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin mr-2" />
              Posting...
            </>
          ) : (
            "Post Internship"
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateInterviewForm;