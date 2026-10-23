import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useConversation from '../stateManage/useConversation';
import toast from 'react-hot-toast';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeContext } from '../context/ThemeContext';

const InterviewSection = () => {
  const navigate = useNavigate();
  const { setAccessInterviewPage, setInterviewData, setInterviewModelId } = useConversation();
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    role: '',
    topic: '',
    numOfQns: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.topic || !formData.numOfQns) {
      toast.error("Please fill the form");
      return;
    }

    if (formData.numOfQns <= 0 || formData.numOfQns > 25) {
      toast.error("Please enter a number between 1 and 25");
      return;
    }

    try {
      setLoading(true);
      const { role, topic, numOfQns } = formData;
      const { data } = await axios.post(
        "http://localhost:8000/interview/checkRoleAndTopic",
        { role, topic, numOfQns },
        { withCredentials: true }
      );

      if (!data.response.valid) {
        setLoading(false);
        return toast.error("Please enter valid Role and Topic!");
      }

      setInterviewModelId(data.interviewModelId);
      setInterviewData({ topic, role, numOfQns });
      setAccessInterviewPage(true);
      navigate('/interviewPage');
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Theme-based styles
 const MaintextColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const containerBg = theme === 'dark' ? 'bg-black' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50';
  const textColor = theme === 'dark' ? 'text-gray-800' : 'text-gray-900';
  const labelColor = theme === 'dark' ? 'text-gray-800' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-white border-gray-700 text-black' : 'bg-white border-gray-300 text-gray-900';
  const inputFocus = 'focus:ring-orange-500 focus:border-orange-500';
  const tipBg = theme === 'dark' ? 'bg-white' : 'bg-orange-50';
  const tipBorder = theme === 'dark' ? 'border-gray-700' : 'border-orange-200';
  return (
    <div className={`min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 ${containerBg}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-bold mb-3 ${MaintextColor}`}>
            Start Your <span className="text-orange-500">AI-Powered</span> Interview
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Customize your interview experience and get ready to excel
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-1/2">
            <div className={`p-8 rounded-2xl shadow-xl h-full ${cardBg}`}>
              <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>Interview Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role */}
                <div>
                  <label htmlFor="role" className={`block text-sm font-medium mb-2 ${labelColor}`}>Job Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer, Data Scientist"
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${inputFocus} transition duration-200 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                {/* Topic */}
                <div>
                  <label htmlFor="topic" className={`block text-sm font-medium mb-2 ${labelColor}`}>Interview Topic</label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g. React.js, Machine Learning, System Design"
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${inputFocus} transition duration-200 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                {/* Number of Questions */}
                <div>
                  <label htmlFor="numOfQns" className={`block text-sm font-medium mb-2 ${labelColor}`}>Number of Questions</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="numOfQns"
                      name="numOfQns"
                      min="1"
                      max="25"
                      value={formData.numOfQns}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${inputFocus} transition duration-200 focus:outline-none focus:ring-2`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/ 25</span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Maximum 25 questions allowed</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" className="mr-2" />
                      Setting Up Your Interview...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Start Interview
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="w-full lg:w-1/2">
            <div className={`p-8 rounded-2xl shadow-xl h-full ${cardBg}`}>
              <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>Interview Preparation Guide</h2>

              {/* Tips */}
              <div className="space-y-6">
                {/* Before Interview */}
                <div className={`p-4 rounded-lg border ${tipBg} ${tipBorder}`}>
                  <h3 className={`font-semibold mb-2 flex items-center ${textColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Before the Interview
                  </h3>
                  <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-gray-800' : 'text-gray-700'}`}>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Ensure you have a quiet environment with good lighting</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Test your microphone and camera beforehand</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Close unnecessary applications on your computer</li>
                  </ul>
                </div>

                {/* During Interview */}
                <div className={`p-4 rounded-lg border ${tipBg} ${tipBorder}`}>
                  <h3 className={`font-semibold mb-2 flex items-center ${textColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    During the Interview
                  </h3>
                  <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-gray-800' : 'text-gray-700'}`}>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Speak clearly and at a moderate pace</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Be honest about what you don't know</li>
                  </ul>
                </div>

                {/* Technical Tips */}
                <div className={`p-4 rounded-lg border ${tipBg} ${tipBorder}`}>
                  <h3 className={`font-semibold mb-2 flex items-center ${textColor}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Technical Tips
                  </h3>
                  <ul className={`text-sm space-y-2 ${theme === 'dark' ? 'text-gray-800' : 'text-gray-700'}`}>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Use a wired internet connection if possible for stability</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Look at the camera when speaking to create eye contact</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Have a notebook handy for quick notes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSection;
