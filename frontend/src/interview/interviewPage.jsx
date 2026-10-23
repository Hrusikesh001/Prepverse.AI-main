



import { cn } from "../lib/utils.js";
import React, { useEffect, useState, useRef, useContext } from "react";
import AssistantPage from "./assistantPage.jsx";
import CandidateSection from "./candidateSection.jsx";
import VoiceConvertor from "../components/voiceToText.jsx";
import useConversation from "../stateManage/useConversation.js";
import axios from "axios";
import TextToVoice from "../components/textTovoice.jsx";
import { useAuth } from "../context/AuthProvider.jsx";
import server from '../environment.js'
import { useNavigate } from 'react-router-dom'
import CountdownTimer from "../components/countDownTimer.jsx";
import InterviewFeedback from "../components/interviewFeedback.jsx";
import creatingReportAnimation from '../assets/animations/creatingReport.json'
import Lottie from "lottie-react";
import { ThemeContext } from "../context/ThemeContext";

function InterviewPage() {
  const [spokenText, setSpokenText] = useState("");
  const [recordingStatus, setRecordingStatus] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [controls, setControls] = useState(null);
  const [userMic, setUserMic] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [finishInterview, setFinishInterview] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState({});
  const [stopSpeaking, setStopSpeaking] = useState(() => () => {});
  const [isMobileView, setIsMobileView] = useState(false);

  const scrollRef = useRef(null);
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const {
    candidateAnswer,
    setCandidateAnswer,
    assistantContent,
    setAssistantContent,
    askedQuestions,
    setAskedQuestions,
    givenAnswers,
    setGivenAnswers,
    interviewData,
    interviewModelId,
    setInterviewModelId,
    distractionDetect,
    setDistractionDetect,
  } = useConversation();
  const [startInterview, setStartInterview] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    setSpokenText(transcript);
    setCandidateAnswer(transcript);
  }, [transcript]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [spokenText]);

  const handleBeginRecordingButton = () => {
    setRecordingStatus(false);
    controls?.startListening();
  }

  const handleEndInterview = async () => {
    setReportLoading(true);
    stopSpeaking();
    
    try {
      const { data } = await axios.post(
        `${server}/interview/evaluateInterviewResult`,
        { interivewId: interviewModelId },
        { withCredentials: true }
      );

      if (data?.interviewData) {
        console.log(data.interviewData);
        setReportData(data.interviewData);
      }

      setReportLoading(false);
    } catch (err) {
      console.log(err);
      setReportLoading(false);
    }

    setStartInterview(false);
    setAskedQuestions([]);
    setAssistantContent("");
  }

  useEffect(() => {
    if (distractionDetect) {
      handleEndInterview();
    }
  }, [distractionDetect]);

  useEffect(() => {
    if (!aiSpeaking && finishInterview) {
      handleEndInterview();
    }
  }, [aiSpeaking, finishInterview]);

  const handleSendRecording = async () => {
    setSpokenText("");
    setRecordingStatus(true);
    controls?.stopListening();
    controls?.resetTranscript();
    setAiSpeaking(true);

    try {
      const role = interviewData?.role;
      const topic = interviewData?.topic;
      const numOfQns = interviewData?.numOfQns;
      const name = authUser.user.name;
      const previousQuestions = askedQuestions;
      const askedQuestion = assistantContent;
      const givenAnswer = candidateAnswer?.trim() === "" ? "Answer Not Provided." : candidateAnswer;
      const modelId = interviewModelId;

      const { data } = await axios.post(`${server}/interview/generate-question`,
        { role, topic, name, previousQuestions, askedQuestion, givenAnswer, numOfQns, modelId },
        { withCredentials: true }
      );

      setAssistantContent(data.responseData);
      askedQuestions.push(data.question);
      setAskedQuestions(askedQuestions);

      if (data.finishInterview) {
        setFinishInterview(data.finishInterview);
        setAiSpeaking(true);
      }

    } catch (err) {
      console.log(err);
    }

    setCandidateAnswer("");
  }

  const handleStartInterview = async () => {
    setStartInterview(true);
    setUserMic(true);
    setAiSpeaking(true);
    try {
      const role = interviewData?.role;
      const topic = interviewData?.topic;
      const numOfQns = interviewData?.numOfQns;
      const name = authUser.user.name;
      const previousQuestions = askedQuestions;
      const modelId = interviewModelId;

      const { data } = await axios.post(`${server}/interview/generate-question`,
        { role, topic, name, previousQuestions, numOfQns, modelId },
        { withCredentials: true }
      );
      setAssistantContent(data.responseData);
      askedQuestions.push(data.question);
      setAskedQuestions(askedQuestions);
    } catch (err) {
      console.log(err);
    }
  }

  if (reportLoading) {
    return (
      <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black' : 'bg-white'} bg-opacity-80 z-[1000] w-[100vw] h-[100vh] flex flex-col items-center justify-center`}>
        <div className="w-120 h-120">
          <Lottie animationData={creatingReportAnimation} loop={true} />
        </div>
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-lg blur opacity-20 bg-transparent"></div>
          <h2 className={`relative text-2xl mt-6 font-semibold animate-pulse p-4 rounded-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Generating Interview Report...
          </h2>
        </div>
      </div>
    );
  }

  if (reportData && Object.keys(reportData).length > 0) {
    return <InterviewFeedback data={reportData} onBack={() => navigate("/")} />;
  }

  // Determine background colors based on theme
  const bgColor = theme === "dark" ? "bg-black" : "bg-white";
  const textColor = "text-black"; // Always black text for transcript box
  const textMutedColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const textHighlightColor = "text-[#ff6900]";
  const cardBgColor = theme === "dark" ? "bg-orange-100" : "bg-orange-50";
  const cardBorderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`relative flex h-[100vh] w-[100vw] items-center justify-center ${bgColor} mt-0`}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          theme === "dark" 
            ? "[background-image:linear-gradient(to_right,rgba(255,165,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,165,0,0.1)_1px,transparent_1px)]"
            : "[background-image:linear-gradient(to_right,rgba(255,165,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,165,0,0.05)_1px,transparent_1px)]"
        )}
      />

      <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${bgColor} [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]`}></div>

      {startInterview && userMic && !aiSpeaking && (
        <div className="absolute top-4 right-6 z-50">
          <CountdownTimer 
            duration={askedQuestions[askedQuestions.length - 1]?.time} 
            onComplete={() => {
              handleSendRecording();
            }} 
          />
        </div>
      )}
      
      {/* Modified container with adjusted spacing */}
      <div className="h-[100%] w-[100%] min-h-[100vh] min-w-[100vw] z-20 flex justify-start items-center flex-col mt-0 pt-4">
        {/* Main content area with reduced height */}
        <div className="h-[65vh] w-[100%] flex flex-row justify-evenly mt-0">
          {/* Conditionally render AssistantPage based on screen size */}
          {!isMobileView && <AssistantPage />}
          
          <CandidateSection startInterview={startInterview} />
          
          <TextToVoice
            onStart={() => setAiSpeaking(true)}
            onEnd={() => setAiSpeaking(false)}
            setStopSpeakingCallback={setStopSpeaking}
          />
        </div>

        {/* Bottom section with negative margin to pull it up */}
        <div className="w-full lg:w-[80%] px-4 lg:px-0 flex flex-col items-center space-y-4 mt-2">
          <div className="w-full relative">
            <div className={`absolute -inset-0.5 rounded-lg blur opacity-20 ${theme === 'dark' ? 'bg-orange-100' : 'bg-orange-50'}`}></div>
            <div className={`relative w-full h-16 p-4 ${cardBgColor} rounded-lg border ${cardBorderColor} shadow-lg overflow-hidden`}>
              <div className="h-full flex items-center">
                <p
                  ref={scrollRef}
                  className={`${textColor} text-lg font-medium whitespace-nowrap overflow-x-auto scroll-smooth no-scrollbar`}
                >
                  {spokenText || (
                    <span className={textMutedColor}>
                      <span className={textHighlightColor}>Waiting...</span> Speak to see text appear
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto pb-4">
            {
              recordingStatus ? (
                <button
                  className={cn(
                    "px-4 py-3 sm:px-6 font-semibold rounded-lg transition-all duration-200 shadow-md transform hover:-translate-y-0.5 focus:outline-none w-full sm:w-auto",
                    theme === "dark" 
                      ? "bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                      : "bg-gray-300 text-black hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50",
                    (!userMic || controls?.isListening || aiSpeaking) && "opacity-50 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700"
                  )}
                  onClick={handleBeginRecordingButton}
                  disabled={!userMic || controls?.isListening || aiSpeaking}
                >
                  Begin Recording
                </button>
              ) : (
                <button
                  className={cn(
                    "px-4 py-3 sm:px-6 font-semibold rounded-lg transition-all duration-200 shadow-md transform hover:-translate-y-0.5 focus:outline-none w-full sm:w-auto",
                    theme === "dark" 
                      ? "bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                      : "bg-gray-300 text-black hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50",
                    (!userMic || !controls?.isListening || aiSpeaking) && "opacity-50 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700"
                  )}
                  onClick={handleSendRecording}
                  disabled={!userMic || !controls?.isListening || aiSpeaking}
                >
                  Send Recording
                </button>
              )
            }

            {
              startInterview ? (
                <button className={cn(
                  "px-4 py-3 sm:px-6 bg-[#ff6900] hover:bg-[#e55d00] font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 w-full sm:w-auto",
                  theme === "dark" ? "text-white" : "text-black"
                )}
                  onClick={handleEndInterview}
                >
                  End Interview
                </button>
              ) : (
                <button className={cn(
                  "px-4 py-3 sm:px-6 bg-[#ff6900] hover:bg-[#e55d00] font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 w-full sm:w-auto",
                  theme === "dark" ? "text-white" : "text-black"
                )}
                  onClick={handleStartInterview}
                >
                  Start Interview
                </button>
              )
            }

            <VoiceConvertor
              onTranscriptUpdate={setTranscript}
              onControlsReady={setControls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;

