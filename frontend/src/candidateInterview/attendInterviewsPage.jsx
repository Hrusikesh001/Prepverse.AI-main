import React, { useState, useContext, useEffect } from "react";
import "./interviewPage.css";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import server from "../environment.js";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import useInternships from "../stateManage/useInternships.js";

function AttendInterviews() {
  const placeholders = ["WhatsApp", "Google", "Microsoft", "Amazon", "TCS"];

  const [search, setSearch] = useState("");
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { searchInternships, setSearchInternships } = useInternships();

  const handleChange = (e) => setSearch(e.target.value);

  useEffect(() => {
    setInterviews(searchInternships);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!search) return toast.error("Please enter valid search!");

    try {
      const { data } = await axios.post(
        `${server}/interview/search-Interviews`,
        { companyName: search },
        { withCredentials: true }
      );

      if (data?.interviews) {
        if (data.interviews.length === 0) toast.error("No Interview Found");
        setInterviews(data.interviews);
        setSearchInternships(data.interviews); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center relative z-10 ${
        theme === "dark" ? "bg-black" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-col w-full max-w-3xl px-6 mt-[4rem]">
        <h2
          className={`text-2xl sm:text-5xl font-bold text-center mb-5 ${
            theme === "dark"
              ? "text-[#ff6900]"
              : "text-[#ff6900]"
          }`}
        >
          Meet Your New Opportunity
        </h2>

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <div className="w-full max-w-6xl px-6 mt-16 pb-16">
        <h3
          className={`text-2xl font-semibold mb-6 ${
            theme === "dark" ? "text-white" : "text-[#ff6900]"
          }`}
        >
          Available AI Interviews
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interviews.map((interview, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 shadow-lg flex flex-col justify-between border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-orange-100 text-gray-900 hover:shadow-[0_0_20px_rgba(255,105,0,0.15)] hover:border-[#ff6900]/30"
                  : "bg-orange-50 text-gray-900 border-gray-200 hover:shadow-md"
              }`}
            >
              <div>
                <h4 className="text-lg font-bold text-center mb-2">
                  {interview.company}
                </h4>
                <p
                  className={`text-center font-medium mb-3 ${
                    theme === "dark" ? "text-gray-700" : "text-gray-700"
                  }`}
                >
                  {interview.jobTitle}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {interview.jobTopic.split(",").map((topic, i) => (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-full ${
                        theme === "dark"
                          ? "bg-orange-200 text-gray-800"
                          : "bg-orange-100 text-gray-700"
                      }`}
                    >
                      {topic.trim()}
                    </span>
                  ))}
                </div>

                <div
                  className={`space-y-1 text-sm text-center ${
                    theme === "dark" ? "text-gray-700" : "text-gray-600"
                  }`}
                >
                  <p>
                    Duration:{" "}
                    <span className="font-medium">{interview.duration}</span>
                  </p>
                  <p>
                    Number of Qns:{" "}
                    <span className="font-medium">{interview.numOfQns}</span>
                  </p>
                  <p>
                    Last Date:{" "}
                    <span className="font-medium">{interview.lastDate}</span>
                  </p>
                  <p>
                    Stipend:{" "}
                    <span className="font-medium">{interview.stipend}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to={`/internships/${interview._id}`}>
                  <button
                    className={`w-full font-medium text-sm py-2 px-4 rounded-full shadow transition duration-300 ${
                      theme === "dark"
                        ? "bg-[#ff6900] text-white hover:bg-[#ff7f33]"
                        : "bg-[#ff6900] text-white hover:bg-[#ff7f33]"
                    }`}
                  >
                    Register Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttendInterviews;