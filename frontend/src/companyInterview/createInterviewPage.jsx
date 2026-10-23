import React, { useContext, useState } from 'react';
import { ArrowRight, Calendar, Clock, DollarSign, Briefcase, Building, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllInterviews } from '../context/getAllInterviews.jsx';
import axios from 'axios';
import server from '../environment.js';
import useConversation from '../stateManage/useConversation.js';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-hot-toast'

function CreateInterviewPage() {
  const navigate = useNavigate();
  const { internships } = useGetAllInterviews();
  const { setReportData } = useConversation();
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleOpenClick = async (interviewId) => {
    try {
      const { data } = await axios.post(
        `${server}/interview/getAllCandidates`,
        { interviewId },
        { withCredentials: true }
      );

      if (data?.candidates) {
        setReportData(data.candidates);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSearchClick = async () => {
    console.log(searchQuery);
    if (!searchQuery || searchQuery.trim() === "") {
      setSearchResults([]);
      return toast.error("Search is empty!");
    }

    try {
      const { data } = await axios.post(
        `${server}/interview/search-Interviews`,
        { companyName: searchQuery },
        { withCredentials: true }
      );

      if(!data.interviews){
        return toast.error("Interview not found!");
      }

      setSearchResults(data.interviews);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center py-14 px-4 relative z-10 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-orange-900'
        }`}
    >
      <h1
        className={`text-4xl font-extrabold mb-6 text-center leading-tight md:leading-snug text-[#ff6900]`}
      >
        Manage Your Interviews
      </h1>

      {/* Search Bar */}
      <div className={`relative w-full max-w-2xl mb-6`}>
        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none`}>
          <Search className={`${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`} size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
          placeholder="Search by job title, company, or topic..."
          className={`w-full py-3 pl-10 pr-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ff6900] ${theme === 'dark'
            ? 'bg-orange-100 border-gray-300 text-gray-900 placeholder-gray-600'
            : 'bg-orange-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
        />
      </div>



      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <div className="w-full max-w-7xl mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Search Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {searchResults.map((interview) => (
              <div
                key={interview._id}
                className={`rounded-2xl p-6 flex flex-col shadow-md transition h-80 ${theme === 'dark'
                  ? 'bg-orange-100 hover:shadow-[0_0_20px_rgba(255,105,0,0.15)] text-gray-900'
                  : 'bg-orange-50 hover:shadow-md text-gray-900'
                  }`}
              >
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-1 line-clamp-1">{interview.jobTitle}</h2>
                    <div className="flex items-center">
                      <Building size={14} className="mr-1" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                        {interview.company}
                      </span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interview.jobTopic.split(', ').map((topic, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 text-sm rounded-full ${theme === 'dark' ? 'bg-orange-200 text-gray-800' : 'bg-orange-100 text-gray-700'
                          }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                        {interview.duration}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase size={14} className="mr-1" />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                        {interview.type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                        {interview.stipend === '0' ? 'Unpaid' : interview.stipend}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                        {interview.jobType}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                        Apply by: {interview.lastDate}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-800' : 'text-gray-700'}`}>
                      {interview.numOfQns} Questions
                    </span>
                  </div>
                </div>

                {/* Open Button fixed at the bottom */}
                <div className="mt-5">
                  <button
                    className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition cursor-pointer ${theme === 'dark'
                      ? 'bg-[#ff6900] text-white hover:bg-[#ff7f33]'
                      : 'bg-[#ff6900] text-white hover:bg-[#ff7f33]'
                      }`}
                    onClick={() => {
                      navigate('/aiInterviews/createInterview/attandants');
                      handleOpenClick(interview._id);
                    }}
                  >
                    Open <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Interviews Section */}
      <div className="w-full max-w-7xl">
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Example Interviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className={`rounded-2xl p-6 flex flex-col shadow-md transition h-80 ${theme === 'dark'
                ? 'bg-orange-100 hover:shadow-[0_0_20px_rgba(255,105,0,0.15)] text-gray-900'
                : 'bg-orange-50 hover:shadow-md text-gray-900'
                }`}
            >
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-1 line-clamp-1">{internship.jobTitle}</h2>
                  <div className="flex items-center">
                    <Building size={14} className="mr-1" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                      {internship.company}
                    </span>
                  </div>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {internship.jobTopic.split(', ').map((topic, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-sm rounded-full ${theme === 'dark' ? 'bg-orange-200 text-gray-800' : 'bg-orange-100 text-gray-700'
                        }`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                      {internship.duration}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase size={14} className="mr-1" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                      {internship.type}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                      {internship.stipend === '0' ? 'Unpaid' : internship.stipend}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                      {internship.jobType}
                    </span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-600'}`}>
                      Apply by: {internship.lastDate}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-800' : 'text-gray-700'}`}>
                    {internship.numOfQns} Questions
                  </span>
                </div>
              </div>

              {/* Open Button fixed at the bottom */}
              <div className="mt-5">
                <button
                    className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition cursor-pointer ${theme === 'dark'
                      ? 'bg-[#ff6900] text-white hover:bg-[#ff7f33]'
                      : 'bg-[#ff6900] text-white hover:bg-[#ff7f33]'
                      }`}
                    onClick={() => {
                      navigate('/aiInterviews/createInterview/attandants');
                      handleOpenClick(internship._id);
                    }}
                  >
                    Open <ArrowRight size={18} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateInterviewPage;