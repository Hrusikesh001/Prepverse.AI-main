import React, { useEffect, useRef, useContext, useState } from "react";

import Lottie from "lottie-react";

import { Link } from "react-router-dom";

import { Rocket } from "lucide-react";

import {

  FaUserCheck,

  FaRobot,

  FaFileAlt,

  FaCode,

  FaChartLine,

  FaSyncAlt,

  FaComments,

  FaQuestionCircle,

  FaFilePdf,

  FaUserPlus,

  FaBriefcase,

} from "react-icons/fa";

  

import globeAnimation from "../assets/Globe1.json";

import Button from "./Button.jsx";

import { ThemeContext } from "../context/ThemeContext";

import interviewImage from "../assets/attend2.png";

import internshipimage from "../assets/Internship_image.png";

import mockInterviewImage from "../assets/attend2.png";

import quizImage from "../assets/heroquiz.png";

import resumeBuilderImage from "../assets/heroresume.png";

  

const steps = [

  {

    icon: <FaUserPlus size={22} />,

    title: "Sign Up",

    desc: "Create account and upload your resume to complete your profile.",

  },

  {

    icon: <FaBriefcase size={22} />,

    title: "Find Internship",

    desc: "Get AI-matched internship opportunities tailored to your skills.",

    highlight: true,

  },

  {

    icon: <FaRobot size={22} />,

    title: "Mock Interviews",

    desc: "Practice real-time AI-driven interviews to sharpen your skills.",

  },

  {

    icon: <FaQuestionCircle size={22} />,

    title: "Skill Quizzes",

    desc: "Test and strengthen your knowledge with targeted AI quizzes.",

  },

  {

    icon: <FaChartLine size={22} />,

    title: "Personalized Feedback",

    desc: "Receive AI-powered insights to improve your performance.",

  },

  {

    icon: <FaSyncAlt size={22} />,

    title: "Track Growth",

    desc: "Monitor your progress and get smarter every day.",

  },

];

  

const Home2 = () => {

  const particlesRef = useRef(null);

  const { theme } = useContext(ThemeContext);

  const [currentSlide, setCurrentSlide] = useState(0);

  const intervalRef = useRef(null);

  

  // Particles effect

  useEffect(() => {

    const loadParticles = () => {

      if (particlesRef.current && window.particlesJS) {

        window.particlesJS("particles-js", {

          particles: {

            number: { value: 200, density: { enable: true, value_area: 1500 } },

            color: { value: theme === "dark" ? "#ffffff" : "#000000" },

            shape: { type: "circle" },

            opacity: {

              value: 0.5,

              random: true,

              anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },

            },

            size: { value: 1, random: true },

            line_linked: { enable: false },

            move: { enable: true, speed: 0.5, random: true, out_mode: "out" },

          },

          interactivity: { detect_on: "canvas", events: { resize: true } },

          retina_detect: true,

        });

      }

    };

  

    if (!window.particlesJS) {

      const script = document.createElement("script");

      script.src =

        "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";

      script.onload = loadParticles;

      document.body.appendChild(script);

      return () => {

        document.body.removeChild(script);

      };

    } else {

      loadParticles();

    }

  }, [theme]);

  

  // Auto-rotate carousel

  useEffect(() => {

    intervalRef.current = setInterval(() => {

      setCurrentSlide((prev) => (prev + 1) % 3);

    }, 4000);

  

    return () => clearInterval(intervalRef.current);

  }, []);

  

  // Manual slide navigation

  const goToSlide = (index) => {

    setCurrentSlide(index);

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {

      setCurrentSlide((prev) => (prev + 1) % 3);

    }, 4000);

  };

  

  const PrimaryAccentText = ({ text }) => (

    <span className="text-[#FF6900]">{text}</span>

  );

  

  // Feature sections data

  const featureSections = [

    {

      id: "mock-interview",

      title: "Mock Interview",

      description:

        "Empower your interview preparation with AI-driven mock interviews, real-time feedback, and performance analysis.",

      icon: <FaComments className="text-[#FF6900] text-2xl" />,

      image: mockInterviewImage,

      features: [

        {

          title: "AI-Powered Interviews",

          desc: "Experience realistic interviews with our advanced AI that adapts to your responses.",

        },

        {

          title: "Real-Time Feedback",

          desc: "Get instant feedback on your answers, communication skills, and body language.",

        },

        {

          title: "Customizable Questions",

          desc: "Choose from industry-specific questions or upload your resume for personalized questions.",

        },

      ],

      cta: {

        text: "Start Mock Interview",

        link: "/mockInterviewLandingPage",

      },

    },

    {

      id: "quiz",

      title: "AI Skill Quiz",

      description:

        "Test and improve your knowledge with adaptive quizzes that challenge your skills and identify areas for improvement.",

      icon: <FaQuestionCircle className="text-[#FF6900] text-2xl" />,

      image: quizImage,

      features: [

        {

          title: "Adaptive Difficulty",

          desc: "Questions adapt to your skill level, getting harder as you improve.",

        },

        {

          title: "Multiple Categories",

          desc: "Choose from technical skills, soft skills, or industry-specific knowledge.",

        },

        {

          title: "Detailed Analytics",

          desc: "Track your progress over time with detailed performance reports.",

        },

      ],

      cta: {

        text: "Take a Quiz",

        link: "/quiz",

      },

    },

    {

      id: "resume-builder",

      title: "Resume Builder",

      description:

        "Create professional, ATS-friendly resumes that highlight your skills and experience effectively.",

      icon: <FaFilePdf className="text-[#FF6900] text-2xl" />,

      image: resumeBuilderImage,

      features: [

        {

          title: "ATS Optimization",

          desc: "Ensure your resume passes through Applicant Tracking Systems with optimized content.",

        },

        {

          title: "Professional Templates",

          desc: "Choose from a variety of professionally designed templates for any industry.",

        },

        {

          title: "Content Suggestions",

          desc: "Get AI-powered suggestions to improve your resume's impact and readability.",

        },

      ],

      cta: {

        text: "Build My Resume",

        link: "/resume",

      },

    },

    // {

    //   id: "attend-interview",

    //   title: "Attend Interview",

    //   description:

    //     "Empower your hiring process with AI-driven interview design, seamless candidate invites, and performance evaluation.",

    //   icon: <FaRobot className="text-[#FF6900] text-2xl" />,

    //   image: interviewImage,

    //   features: [

    //     {

    //       title: "Custom Interview Design",

    //       desc: "Easily create structured interview processes tailored to your company's needs.",

    //     },

    //     {

    //       title: "Candidate Insights",

    //       desc: "Analyze candidate performance with AI-powered evaluation and actionable feedback.",

    //     },

    //     {

    //       title: "Streamlined Process",

    //       desc: "Simplify your hiring workflow with intuitive tools and automated scheduling.",

    //     },

    //   ],

    //   cta: {

    //     text: "Learn More",

    //     link: "/candidate/dashboard",

    //   },

    // },

  ];

  

  return (

    <div

      className={`flex flex-col min-h-screen overflow-x-hidden transition-colors duration-500 ${

        theme === "dark"

          ? "bg-[#0D0D0D] text-white"

          : "bg-[#FFFFFF] text-[#1A1A1A]"

      }`}

    >

      {/* Background Particles */}

      <div

        ref={particlesRef}

        id="particles-js"

        className={`fixed top-0 left-0 w-full h-full z-0 ${

          theme === "dark" ? "bg-[#0e0805]" : "bg-[#F9F9F9]"

        }`}

        style={{

          backgroundImage:

            theme === "dark"

              ? "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)"

              : "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",

          backgroundSize: "30px 30px",

        }}

      ></div>

  

      {/* Main Page Content */}

      <div className="relative z-10 font-inter flex-1">

        {/* Hero Section*/}

        <section className="container w-[100vw] mx-auto px-4 sm:px-6 md:px-8 lg:px-48 py-8 md:py-16 grid md:grid-cols-2 gap-0 items-center justify-center min-h-[100vh]">

          <div className="flex flex-col justify-center space-y-6">

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins leading-tight">

              <span className="block">

                Welcome to <PrimaryAccentText text="Prepverse.AI" />

              </span>

              <span className="block mt-2 text-2xl md:text-3xl font-normal">

                Your personalized internship recommender

              </span>

            </h1>

  

            <p

              className={`text-lg md:text-xl font-inter max-w-lg leading-relaxed ${

                theme === "dark" ? "text-[#CCCCCC]" : "text-[#666666]"

              }`}

            >

              Discover the perfect internship match with our Al-powered

              recommendation system - tailored to your skills, background, and

              aspirations.

            </p>

            <div className="flex flex-wrap gap-4 pt-2">

              <Link to="/signup">

                <Button />

              </Link>

            </div>

          </div>

  

          {/* Right - Lottie Globe */}

          <div className="flex justify-center items-center ml-0 sm:ml-10">

            <div className="w-[350px] h-[370px] sm:w-[390px] sm:h-[390px] md:w-[430px] md:h-[430px] lg:w-[470px] lg:h-[470px]">

              <Lottie animationData={globeAnimation} loop={true} />

            </div>

          </div>

        </section>

  

        {/* Internship Section */}

        <section className="py-12 md:py-16 px-6 sm:px-10 md:px-14 lg:px-24 xl:px-32 relative">

          <div className="mx-auto">

            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Left Side: Image */}

              <div className="flex justify-center">

                <img

                  src={internshipimage}

                  alt="Internship Illustration"

                  className="rounded-2xl w-full max-w-md shadow-[0_0_5px_#FF6900,0_0_20px_#FF8C00]"

                />

              </div>

  

              {/* Right Side: Content - Added right padding for balance */}

              <div className="pr-8 md:pr-12 lg:pr-16">

                <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">

                  Land Your Dream <PrimaryAccentText text="Internship" />

                </h2>

  

                <p

                  className={`text-lg font-inter max-w-2xl leading-relaxed mb-8 ${

                    theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                  }`}

                >

                  Our AI-powered platform helps you discover, prepare for, and

                  secure the perfect internship.

                </p>

  

                {/* Steps */}

                <div className="space-y-6">

                  <div className="flex items-start">

                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">

                      ◆

                    </span>

                    <div>

                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">

                        Sign Up & Complete Profile

                      </h3>

                      <p

                        className={`${

                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                        }`}

                      >

                        Create your account and upload your resume to help our

                        AI understand your skills, interests, and career goals.

                      </p>

                    </div>

                  </div>

  

                  <div className="flex items-start">

                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">

                      ◆

                    </span>

                    <div>

                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">

                        Get Personalized Recommendations

                      </h3>

                      <p

                        className={`${

                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                        }`}

                      >

                        Our AI algorithm matches you with ideal internship

                        opportunities based on your profile, skills, and

                        preferences.

                      </p>

                    </div>

                  </div>

  

                  <div className="flex items-start">

                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">

                      ◆

                    </span>

                    <div>

                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">

                        Prepare & Apply

                      </h3>

                      <p

                        className={`${

                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                        }`}

                      >

                        Use our interview preparation tools, resume builder, and

                        skill assessments to stand out and secure your

                        internship.

                      </p>

                    </div>

                  </div>

                </div>

  

                {/* CTA Button */}

                <div className="mt-8">

                  <Link to="/internships">

                    <button className="px-6 py-3 md:px-8 md:py-3 rounded-2xl font-semibold bg-gradient-to-r from-[#FF6900] to-[#FF8C00] text-white font-poppins transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#FF6900] text-base md:text-lg flex items-center">

                      Start Your Internship Journey

                      <Rocket size={18} className="ml-2" />

                    </button>

                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>

  

        {/* AI-Driven Career Recommendation */}

        <section className="py-12 md:py-16 px-6 sm:px-10 md:px-14 lg:px-24 xl:px-32 relative">

          <div className="mx-auto">

            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Left Side: Content - Added left padding for balance */}

              <div className="pl-8 md:pl-12 lg:pl-16">

                <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">

                  AI-Driven <PrimaryAccentText text="Career Recommendation" />

                </h2>

  

                <p

                  className={`text-lg font-inter max-w-2xl leading-relaxed mb-8 ${

                    theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                  }`}

                >

                  Empower your future with personalized career paths, step-by-step roadmaps, and smart learning recommendations powered by AI.

                </p>

  

                {/* Steps */}

                <div className="space-y-6">

                  <div className="flex items-start">

                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">

                      ◆

                    </span>

                    <div>

                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">

                        Get Career Recommendations

                      </h3>

                      <p

                        className={`${

                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                        }`}

                      >

                        AI analyzes your profile and resume data to suggest the most suitable career paths tailored to your unique skills and interests.

                      </p>

                    </div>

                  </div>

  

                  <div className="flex items-start">

                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">

                      ◆

                    </span>

                    <div>

                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">

                        Receive a Personalized Roadmap

                      </h3>

                      <p

                        className={`${

                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                        }`}

                      >

                        Select your preferred career to unlock a bespoke step-by-step roadmap, helping you progress with clarity toward your goals.

                      </p>

                    </div>

                  </div>

  

                  <div className="flex items-start">

                    <span className="text-[#FF6900] text-xl font-poppins font-bold mr-3">

                      ◆

                    </span>

                    <div>

                      <h3 className="text-xl font-semibold text-[#FF6900] mb-2">

                        Continuous Learning Suggestions

                      </h3>

                      <p

                        className={`${

                          theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                        }`}

                      >

                        Our AI recommends curated courses and resources to support your ongoing growth, from beginner fundamentals to advanced expertise.

                      </p>

                    </div>

                  </div>

                </div>

  

                {/* CTA Button */}

                <div className="mt-8">

                  <Link to="/internships">

                    <button className="px-6 py-3 md:px-8 md:py-3 rounded-2xl font-semibold bg-gradient-to-r from-[#FF6900] to-[#FF8C00] text-white font-poppins transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#FF6900] text-base md:text-lg flex items-center">

                      Start Your AI Career Guide

                      <Rocket size={18} className="ml-2" />

                    </button>

                  </Link>

                </div>

              </div>

  

              {/* Right Side: Image */}

              <div className="flex justify-center">

                <img

                  src={internshipimage}

                  alt="Internship Illustration"

                  className="rounded-2xl w-full max-w-md shadow-[0_0_5px_#FF6900,0_0_20px_#FF8C00]"

                />

              </div>

            </div>

          </div>

        </section>

  

        {/* Features Section */}

        <section className="mx-auto px-6 sm:px-10 md:px-14 lg:px-24 xl:px-32 py-12 md:py-20">

          <div className="text-center mb-8 md:mb-12">

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold">

              Supercharge Your <PrimaryAccentText text="Career Journey" />

            </h2>

            <p

              className={`text-lg md:text-xl font-inter max-w-2xl mx-auto mt-4 leading-relaxed ${

                theme === "dark" ? "text-[#E5E5E5]" : "text-[#333333]"

              }`}

            >

              Everything you need to ace interviews and build your career

            </p>

          </div>

  

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

            {[

              {

                title: "Mock Interviews",

                desc: "Prepare for the real deal with instant AI feedback, Get your customized question either based on your resume or topic.",

                link: "/mockInterviewLandingPage",

                btn: "Practice Now",

              },

              {

                title: "AI Skill Quiz",

                desc: "Discover strengths with AI-powered quizzes, fully customized choose subject, number of question and difficulty level and done.",

                link: "/quiz",

                btn: "Take a Quiz",

              },

              {

                title: "Resume Builder",

                desc: "Craft a professional resume that gets noticed, choose your template, fill your details and just download it.",

                link: "/resume",

                btn: "Build My Resume",

              },

            ].map((card, i) => (

              <div

                key={i}

                className={`p-6 md:p-7 rounded-lg border flex flex-col space-y-4 transition-all hover:-translate-y-1 ${

                  theme === "dark"

                    ? "bg-orange-100 border-[#2A2A2A] hover:border-[#FF6900] hover:shadow-[0_0_25px_#FF690040]"

                    : "bg-orange-50 border-[#EAEAEA] shadow-md hover:border-[#FF6900] hover:shadow-[0_0_25px_#FF690020]"

                }`}

              >

                <h3

                  className={`text-xl md:text-2xl font-poppins font-semibold ${

                    theme === "dark" ? "text-[#111111]" : "text-[#222222]"

                  }`}

                >

                  <span className="text-[#FF6900] text-2xl md:text-3xl">

                    {" "}

                    ◆{" "}

                  </span>

                  {card.title}

                </h3>

                <p

                  className={`text-sm md:text-base font-inter leading-relaxed ${

                    theme === "dark" ? "text-[#1A1A1A]" : "text-[#444444]"

                  }`}

                >

                  {card.desc}

                </p>

                <Link to={card.link}>

                  <button className="mt-4 bg-[#FF6900] text-white font-poppins font-bold py-2 px-4 md:py-2.5 md:px-5 rounded-full transition-transform hover:scale-105 text-sm md:text-base">

                    {card.btn}

                  </button>

                </Link>

              </div>

            ))}

          </div>

        </section>

  

        {/* Workflow Section */}

        <section className="py-12 md:py-20 relative px-6 sm:px-10 md:px-14 lg:px-24 xl:px-32">

          <div className="mx-auto text-center">

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold mb-4">

              How <PrimaryAccentText text="Prepverse.AI" /> Works

            </h2>

            <p

              className={`text-lg md:text-xl font-inter max-w-2xl mx-auto mt-2 mb-8 leading-relaxed ${

                theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

              }`}

            >

              The smartest AI-powered career prep journey, designed to help you

              succeed.

            </p>

  

            <div className="relative">

              <div

                className="hidden md:block absolute top-8 left-0 w-full h-[2px]

                           bg-gradient-to-r from-[#FF6900] via-[#FF6900] to-[#FF6900]

                          shadow-[0_0_15px_#FF6900,0_0_30px_#FF6900]"

              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 relative z-10">

                {steps.map((step, index) => (

                  <div

                    key={index}

                    className="flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"

                  >

                    <div

                      className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-4 shadow-md ${

                        step.highlight

                          ? "ring-2 ring-white bg-[#FF6900] text-white"

                          : theme === "dark"

                          ? "bg-[#141414] border border-[#2A2A2A] text-[#FF6900] shadow-[#ff690050]"

                          : "bg-white border border-[#EAEAEA] text-[#FF6900]"

                      }`}

                    >

                      {step.icon}

                    </div>

                    <h3

                      className={`text-base md:text-lg font-poppins ${

                        step.highlight

                          ? "text-[#FF6900] font-bold"

                          : theme === "dark"

                          ? "text-gray-100 font-semibold"

                          : "text-gray-900 font-semibold"

                      }`}

                    >

                      {step.title}

                    </h3>

  

                    <p

                      className={`text-xs md:text-sm font-inter leading-relaxed max-w-[160px] ${

                        theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                      }`}

                    >

                      {step.desc}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

  

        {/* Feature Detail Sections */}

        {featureSections.map((section, index) => (

          <section

            key={section.id}

            id={section.id}

            className={`py-12 md:py-20 px-6 sm:px-10 md:px-14 lg:px-24 xl:px-32 ${

              index % 2 === 1

                ? "bg-gradient-to-r from-transparent via-[#FF6900]/5 to-transparent"

                : ""

            }`}

          >

            <div className="mx-auto">

              <div

                className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${

                  index % 2 === 1 ? "md:direction-rtl" : ""

                }`}

              >

                <div className={index % 2 === 1 ? "md:order-2" : ""}>

                  <div className="flex items-center mb-4">

                    <div className="mr-3 p-2 rounded-full bg-[#FF6900]/10">

                      {section.icon}

                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-[#FF6900]">

                      {section.title}

                    </h1>

                  </div>

                  <p

                    className={`text-sm md:text-base font-inter pt-6 mb-8 leading-relaxed ${

                      theme === "dark" ? "text-[#CCCCCC]" : "text-[#444444]"

                    }`}

                  >

                    {section.description}

                  </p>

                  <div className="space-y-6">

                    {section.features.map((item, i) => (

                      <div key={i} className="flex items-start space-x-4">

                        <span className="text-[#FF6900] text-xl font-poppins font-bold">

                          ◆

                        </span>

                        <div>

                          <h4

                            className={`text-lg md:text-xl font-poppins font-medium ${

                              theme === "dark" ? "text-white" : "text-[#1A1A1A]"

                            }`}

                          >

                            {item.title}

                          </h4>

                          <p

                            className={`text-sm md:text-base font-inter leading-relaxed ${

                              theme === "dark"

                                ? "text-[#CCCCCC]"

                                : "text-[#444444]"

                            }`}

                          >

                            {item.desc}

                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  <div className="mt-8">

                    <Link to={section.cta.link}>

                      <button className="px-6 py-3 md:px-8 md:py-3.5 rounded-2xl font-semibold bg-[#FF6900] text-white font-poppins transition-transform hover:scale-105 hover:shadow-[0_0_20px_#FF6900aa] text-sm md:text-base">

                        {section.cta.text}

                        <Rocket size={18} className="inline-block ml-2" />

                      </button>

                    </Link>

                  </div>

                </div>

                <div

                  className={`relative ${index % 2 === 1 ? "md:order-1" : ""}`}

                >

                  {/* Multiple glow layers for depth */}

                  <div

                    className={`absolute -inset-4 rounded-lg blur-lg opacity-30 transition-all duration-700 ${

                      theme === "dark" ? "bg-[#FF6900]/5" : "bg-[#FF6900]/5"

                    }`}

                  ></div>

  

                  <div

                    className={`absolute -inset-2 rounded-lg blur-md opacity-50 transition-all duration-500 ${

                      theme === "dark" ? "bg-[#FF6900]/5" : "bg-[#FF6900]/10"

                    }`}

                  ></div>

  

                  {/* Main image container with glow */}

                  <div

                    className={`relative rounded-lg overflow-hidden flex items-center justify-center border transition-all duration-300 shadow-[0_0_10px_#FF6900,0_0_20px_#FF6900] ${

                      theme === "dark"

                        ? "bg-[#141414] border-[#2A2A2A]"

                        : "bg-[#F9F9F9] border-[#EAEAEA]"

                    }`}

                  >

                    <img

                      src={section.image}

                      alt={section.title}

                      className="w-full h-auto object-cover relative z-10 transform transition-transform duration-500 hover:scale-105"

                      style={{ maxHeight: "400px" }}

                    />

  

                    {/* Subtle gradient overlay */}

                    <div

                      className={`absolute inset-0 bg-gradient-to-br opacity-20 ${

                        theme === "dark"

                          ? "from-[#FF6900]/10 via-transparent to-[#FF6900]/5"

                          : "from-[#FF6900]/5 via-transparent to-[#FF6900]/5"

                      }`}

                    ></div>

  

                    {/* Edge glow */}

                    <div

                      className={`absolute inset-0 rounded-lg border-2 opacity-50 ${

                        theme === "dark"

                          ? "border-[#FF6900]/10"

                          : "border-[#FF6900]/10"

                      }`}

                    ></div>

                  </div>

                </div>

              </div>

            </div>

          </section>

        ))}

  

        {/* Call to Action */}

        {/* Call to Action */}

        <section className="py-16 text-center w-full">

          <div

            className={`p-8 rounded-xl max-w-4xl mx-auto shadow-md border

              ${theme === "dark" ? "bg-orange-100 border-[#2A2A2A]" : "bg-orange-50 border-[#EAEAEA]"}`}

          >

            <h2 className={`text-3xl md:text-4xl font-bold mb-4 font-poppins ${theme === "dark" ? "text-black" : "text-black"

              }`}>

              Ready to <span className="text-[#FF6900]">Launch?</span>

            </h2>

            <p

              className={`text-base mb-8 max-w-lg mx-auto ${theme === "dark" ? "text-[#1a1a1a]" : "text-[#555555]"

                }`}

            >

              Don't just look for a job, find the perfect launchpad for your

              career with Prepverse.AI.

            </p>

            <Link to="/internships">

              <button

                className="px-8 py-3 rounded-md font-medium

                  bg-[#FF6900] text-white hover:bg-[#e65f00]

                  transition-colors duration-300"

              >

                Get Started Now

                <Rocket size={18} className="inline-block ml-2" />

              </button>

            </Link>

          </div>

        </section>

      </div>

    </div>

  );

};

  

export default Home2;