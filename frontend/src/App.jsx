import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import { Toaster } from "react-hot-toast";

import { NavbarDemo } from "./components/navBar";
import Footer from "./components/footerComponent";
import SignupForm from "./components/signUp";
import Login from "./components/login";
import Logout from "./components/logout";
import InterviewFeedback from "./components/interviewFeedback";
import ResumeProcessingPage from "./components/resumeProgressPage";
import ProfilePage from "./components/profilePage";
import AICareerGuide from "./components/AICareerGuide.jsx";

import HomeComponent from "./home/home";
import Home2 from "./Home2/home2";

import InterviewPage from "./interview/interviewPage";
import InterviewForm from "./interview/interviewForm";
import ProfileInterviewForm from "./interview/profileInterviewForm";
import { MockInterviewLandingPage } from "./interview/interviewLandingPage";

import QuizPage from "./quiz/QuizPage";
import QuizStart from "./quiz/QuizeStart";

import ResumeLandingPage from "./resumeBuilder/resumeLandingPage";
import ResumeForm from "./resumeBuilder/resumeForm";
import SelectResume from "./resumeBuilder/selectResume";

import AttendInterviews from "./candidateInterview/attendInterviewsPage";
import CandidateLandingPage from "./candidateInterview/CandidateLandingPage";

import CreateInterviewPage from "./companyInterview/createInterviewPage";
import CompanyLandingPage from "./companyInterview/CompanyLandingPage";
import { AttandantPage } from "./companyInterview/attandantPage";

import { ResumesProvider } from "./context/getAllResume";
import { InterviewsProvider } from "./context/getAllInterviews";
import { useAuth } from "./context/AuthProvider";

import useConversation from "./stateManage/useConversation";
import useResumeStore from "./stateManage/useResumeStore";

import server from "./environment";
import pageNotFound from "./assets/animations/errorAnimation.json";
import InternshipPage from "./internships/InternshipPage";
import InternshipDetail from "./internships/InternshipDetail";
import CreateInterviewForm from "./companyInterview/createInterviewForm.jsx";
import InternshipDetails from "./candidateInterview/internshipDetails.jsx";

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const { authUser, setAuthUser } = useAuth();
  const { interviewModelId } = useConversation();
  const { resumeData } = useResumeStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get(`${server}/verify-token`, { withCredentials: true });
      } catch {
        localStorage.removeItem("authUserData");
        setAuthUser(null);
      }
    };
    checkSession();
  }, []);

  
  // Botpress chatbot integration
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    script1.async = true;

    let script2 = null;
    let cancelled = false;

    const loadConfigScript = () => {
      if (cancelled) return;

      script2 = document.createElement("script");
      script2.src =
        "https://files.bpcontent.cloud/2024/12/29/18/20241229184239-XIQB3NQ6.js";
      script2.async = true;

      document.body.appendChild(script2);
    };

    script1.onload = loadConfigScript;
    script1.onerror = () => {
      console.error("Failed to load the Botpress webchat library.");
    };

    document.body.appendChild(script1);

    return () => {
      cancelled = true;
      script1.onload = null;
      script1.onerror = null;

      script1.remove();
      script2?.remove();
    };
  }, []);


  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Toaster toastOptions={{ style: { zIndex: 9999 } }} />

        {/* Navbar always visible */}
        <div className="fixed top-0 left-0 w-full z-30">
          <NavbarDemo />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center flex-grow w-[100vw] mt-[60px]">
          <Routes>
            {/* Home Pages */}
            <Route path="/" element={<Home2 />} />
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/home2" element={<Home2 />} />

            {/* Interview */}
            <Route
              path="/interviewPage"
              element={
                authUser && interviewModelId ? (
                  <InterviewPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/interviewForm"
              element={
                authUser ? <InterviewForm /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/profileInterviewForm"
              element={
                authUser ? (
                  <ProfileInterviewForm />
                ) : (
                  <Navigate to="/mockInterviewLandingPage" replace />
                )
              }
            />
            <Route
              path="/interview/result"
              element={
                authUser ? <InterviewFeedback /> : <Navigate to="/" replace />
              }
            />

            {/* Auth */}
            <Route
              path="/signup"
              element={authUser ? <Home2 /> : <SignupForm />}
            />
            <Route path="/login" element={authUser ? <Home2 /> : <Login />} />
            <Route path="/logout" element={authUser ? <Logout /> : <Home2 />} />

            {/* Quiz */}
            <Route
              path="/quiz"
              element={
                authUser ? <QuizPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/quiz/start"
              element={
                authUser ? <QuizStart /> : <Navigate to="/login" replace />
              }
            />

            {/* Resume */}
            <Route
              path="/resume"
              element={
                authUser ? (
                  <ResumeLandingPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/resume/selectResume"
              element={
                authUser ? (
                  <ResumesProvider>
                    <SelectResume />
                  </ResumesProvider>
                ) : (
                  <Navigate to="/resume" replace />
                )
              }
            />
            <Route
              path="/resume/resumeForm"
              element={
                authUser && resumeData?.title ? (
                  <ResumeForm />
                ) : (
                  <Navigate to="/resume/selectResume" replace />
                )
              }
            />
            <Route
              path="/ResumeProcessingPage"
              element={
                authUser ? (
                  <ResumeProcessingPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Candidate */}
            <Route
              path="/candidate/dashboard"
              element={
                authUser ? (
                  <CandidateLandingPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/candidate/attend"
              element={
                authUser ? <AttendInterviews /> : <Navigate to="/" replace />
              }
            />

            {/* Company */}
            <Route
              path="/company/dashboard"
              element={
                authUser ? <CompanyLandingPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/company/createInterview"
              element={
                authUser ? (
                  <InterviewsProvider>
                    <CreateInterviewPage />
                  </InterviewsProvider>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/aiInterviews/createInterview/attandants"
              element={
                authUser ? <AttandantPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/company/createInterviewForm"
              element={
                authUser ? <CreateInterviewForm /> : <Navigate to="/" replace />
              }
            />

            {/* Mock Interview */}
            <Route
              path="/mockInterviewLandingPage"
              element={
                authUser ? (
                  <MockInterviewLandingPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Profile */}
            <Route
              path="/profilePage"
              element={authUser ? <ProfilePage /> : <Navigate to="/" replace />}
            />
            <Route path="/aicareerguide" element={<AICareerGuide />} />

            {/* Internships */}
            <Route
              path="/internships"
              element={
                authUser ? <InternshipPage /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/internship/:id" element={<InternshipDetail />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-black text-white">
                  <Lottie
                    animationData={pageNotFound}
                    loop={true}
                    className="w-[400px] h-[400px]"
                  />
                </div>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
