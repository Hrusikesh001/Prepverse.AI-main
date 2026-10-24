import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeContext";
import server from "../environment";
import {
  Sparkles,
  Compass,
  Target,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  ChevronRight,
  X,
  ExternalLink,
  RefreshCw,
  Search,
  Briefcase,
  TrendingUp,
  Layers,
  AlertCircle,
  Zap,
  Code,
  Shield,
  Cpu,
  Cloud,
  Smartphone,
  Database,
  ArrowLeft,
  Check,
  Plus,
  PlayCircle,
  FileCheck,
  Sun,
  Moon,
  Info
} from "lucide-react";

const FLASK_API = "http://127.0.0.1:5000/api";

const SUGGESTED_INTERESTS = [
  { name: "Artificial Intelligence", icon: Cpu },
  { name: "Machine Learning", icon: Zap },
  { name: "Web Development", icon: Code },
  { name: "Data Science", icon: Database },
  { name: "Cybersecurity", icon: Shield },
  { name: "Cloud Computing", icon: Cloud },
  { name: "Mobile Development", icon: Smartphone },
  { name: "DevOps & SRE", icon: Layers }
];

const EXPERIENCE_LEVELS = [
  { id: "student", label: "Student / Beginner", desc: "Building foundational skills" },
  { id: "intermediate", label: "Intermediate", desc: "1-3 years of study or projects" },
  { id: "advanced", label: "Advanced", desc: "Looking to specialize or transition" }
];

function AICareerGuide() {
  const { authUser } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // Form & Interaction state
  const [interestInput, setInterestInput] = useState("");
  const [selectedInterestChip, setSelectedInterestChip] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("student");

  // Backend resume state
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [resumeError, setResumeError] = useState("");

  // AI recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [aiError, setAiError] = useState("");
  const [selectedCareerModal, setSelectedCareerModal] = useState(null);
  const [activeSourceType, setActiveSourceType] = useState("initial"); // 'initial' | 'resume' | 'custom'

  const inputPanelRef = useRef(null);

  // ── 1. Fetch Resume Data from Prepverse backend on mount ───────────────────
  useEffect(() => {
    let isMounted = true;
    const fetchResume = async () => {
      setResumeLoading(true);
      setResumeError("");
      try {
        const { data } = await axios.post(
          `${server}/resume-upload/getResumeData`,
          {},
          { withCredentials: true }
        );
        if (isMounted) {
          if (data?.resume_data?.resumeJSONdata) {
            const rd = data.resume_data.resumeJSONdata;
            setResumeData(rd);
            // Prepopulate skills from resume
            const extracted = extractSkillsFromResume(rd);
            if (extracted.length > 0) {
              setSkillsList(extracted.slice(0, 8));
            }
            if (rd.interests && rd.interests.length > 0) {
              const firstInt = typeof rd.interests[0] === 'string' ? rd.interests[0] : rd.interests[0]?.name;
              if (firstInt) setInterestInput(firstInt);
            }
          } else {
            setResumeError("No uploaded resume found. You can enter your skills and interests manually below.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setResumeError("Could not retrieve resume data. You can still customize interests and skills manually below.");
        }
      } finally {
        if (isMounted) setResumeLoading(false);
      }
    };

    fetchResume();
    return () => { isMounted = false; };
  }, []);

  // Helper to extract skills cleanly from resume
  const extractSkillsFromResume = (rd) => {
    if (!rd) return [];
    const skillsRaw = rd.skills || [];
    const collected = [];
    skillsRaw.forEach((cat) => {
      if (typeof cat === "string") {
        collected.push(cat);
      } else if (cat && Array.isArray(cat.items)) {
        collected.push(...cat.items);
      }
    });
    return Array.from(new Set(collected.filter(Boolean)));
  };

  // ── 2. Automatic initial recommendations once resume is ready ───────────────
  useEffect(() => {
    if (resumeData && recommendations.length === 0 && !aiLoading && activeSourceType === "initial") {
      generateFromResume(resumeData);
    }
  }, [resumeData]);

  // Loading steps animation
  useEffect(() => {
    let interval;
    if (aiLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [aiLoading]);

  // ── 3. API Handlers ─────────────────────────────────────────────────────────

  // Generate recommendations directly from full resume
  const generateFromResume = async (rd) => {
    setAiLoading(true);
    setAiError("");
    setActiveSourceType("resume");

    try {
      const response = await fetch(`${FLASK_API}/recommend-by-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: rd }),
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      } else {
        setAiError(data.error || "Unable to generate career recommendations. Please verify the AI service is active.");
      }
    } catch (err) {
      setAiError("Cannot reach the AI Career Engine (http://127.0.0.1:5000). Please ensure the Python service is running.");
    } finally {
      setAiLoading(false);
    }
  };

  // Generate recommendations from interest form + skills
  const handleGenerateCustomPlan = async (e) => {
    if (e) e.preventDefault();

    const targetInterest = (interestInput || selectedInterestChip || "").trim();
    if (!targetInterest) {
      setAiError("Please select or type a career interest (e.g., 'Web Development' or 'Cybersecurity').");
      inputPanelRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setAiLoading(true);
    setAiError("");
    setActiveSourceType("custom");

    // Construct valid resumeData payload matching Flask backend requirements
    const payloadResume = resumeData
      ? {
          ...resumeData,
          interests: [targetInterest, ...(resumeData.interests || [])],
          skills: [
            ...(resumeData.skills || []),
            { category: "User Skills", items: skillsList.length ? skillsList : [targetInterest] }
          ]
        }
      : {
          name: authUser?.user?.name || "Aspiring Technologist",
          title: targetInterest,
          interests: [targetInterest],
          skills: [{ category: "Key Skills", items: skillsList.length ? skillsList : [targetInterest] }],
          summary: `Candidate seeking guidance in ${targetInterest}. Proficiency: ${experienceLevel}. Skills: ${skillsList.join(", ") || targetInterest}.`
        };

    try {
      const response = await fetch(`${FLASK_API}/guidance-by-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: payloadResume,
          interest: targetInterest
        }),
      });
      const data = await response.json();

      if (data.success && data.guidance) {
        const results = Array.isArray(data.guidance) ? data.guidance : [data.guidance];
        setRecommendations(results);
      } else {
        setAiError(data.error || "Could not generate a career plan for this interest. Try another topic.");
      }
    } catch (err) {
      setAiError("Failed to connect to the AI service at http://127.0.0.1:5000. Please ensure the backend server is running.");
    } finally {
      setAiLoading(false);
    }
  };

  // Chip click handler
  const handleChipClick = (interestName) => {
    setSelectedInterestChip(interestName);
    setInterestInput(interestName);
    setAiError("");
  };

  // Add custom skill tag
  const handleAddSkill = (e) => {
    if (e && e.key && e.key !== "Enter") return;
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setCustomSkillInput("");
    }
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const scrollToInput = () => {
    inputPanelRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "bg-[#0B0F17] text-gray-100" : "bg-[#F8FAFC] text-gray-900"}`}>
      
      {/* ── Section A: Navigation & Subheader ───────────────────────────── */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${isDark ? "bg-[#0B0F17]/90 border-gray-800" : "bg-white/90 border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/home2"
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <span className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>/</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                AI Career Guide
              </span>
              <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                isDark ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-50 text-orange-600 border border-orange-200"
              }`}>
                <Sparkles className="w-3 h-3 mr-1 text-orange-500 animate-pulse" />
                Intelligent Advisor
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {resumeData ? (
              <span className={`hidden md:inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                <FileCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Resume Synchronized
              </span>
            ) : (
              <span className={`hidden md:inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
              }`}>
                <Info className="w-3.5 h-3.5 mr-1" />
                Manual Exploration Mode
              </span>
            )}

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-lg border transition-all ${
                  isDark
                    ? "bg-gray-800/80 border-gray-700 text-amber-400 hover:bg-gray-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── Section B: Hero Section ───────────────────────────────────── */}
        <section className={`relative overflow-hidden rounded-2xl border p-8 sm:p-12 transition-all ${
          isDark
            ? "bg-gradient-to-br from-[#131B26] via-[#101722] to-[#0B0F17] border-gray-800 shadow-2xl shadow-black/50"
            : "bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 border-gray-200/80 shadow-xl shadow-orange-500/5"
        }`}>
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Compass className="w-3.5 h-3.5 text-orange-500 animate-spin-slow" />
              <span>Your Personal AI Career Companion</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Discover a Career That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400">
                Fits You
              </span>
              .
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Explore personalized career paths, identify the skills employers value, and build an actionable learning roadmap designed around your unique background and ambitions.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={scrollToInput}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
              >
                <span>Customize Your Career Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {resumeData && (
                <button
                  onClick={() => generateFromResume(resumeData)}
                  disabled={aiLoading}
                  className={`px-5 py-3 rounded-xl font-semibold border transition-all flex items-center space-x-2 ${
                    isDark
                      ? "border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 hover:border-orange-500/50"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-orange-400 shadow-sm"
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 text-orange-500 ${aiLoading ? "animate-spin" : ""}`} />
                  <span>Analyze From Resume</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Status Banner for Resume Sync ─────────────────────────────── */}
        {resumeLoading && (
          <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
            isDark ? "bg-blue-950/20 border-blue-900/50 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700"
          }`}>
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm">Synchronizing your resume from Prepverse Profile...</span>
          </div>
        )}

        {resumeError && !resumeLoading && (
          <div className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
            isDark ? "bg-amber-950/20 border-amber-900/50 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span>{resumeError}</span>
            </div>
            <Link
              to="/profilePage"
              className="ml-4 font-semibold text-orange-500 hover:underline flex-shrink-0"
            >
              Upload Resume →
            </Link>
          </div>
        )}

        {/* ── Section C: Career-Interest Input Panel ───────────────────── */}
        <section
          ref={inputPanelRef}
          className={`rounded-2xl border p-6 sm:p-8 transition-all ${
            isDark ? "bg-[#131B26] border-gray-800 shadow-xl" : "bg-white border-gray-200 shadow-lg shadow-slate-200/50"
          }`}
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-gray-700/40">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
                <Target className="w-6 h-6 text-orange-500" />
                <span>Career Interest & Skill Profiler</span>
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Specify your desired role or domain and skills to guide the AI recommendation engine.
              </p>
            </div>
            {resumeData && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium self-start sm:self-auto ${
                isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"
              }`}>
                Detected: {extractSkillsFromResume(resumeData).length} skills from resume
              </span>
            )}
          </div>

          <form onSubmit={handleGenerateCustomPlan} className="space-y-6">
            {/* Primary Domain Input */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Preferred Career Domain or Job Title <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => {
                    setInterestInput(e.target.value);
                    if (selectedInterestChip && e.target.value !== selectedInterestChip) {
                      setSelectedInterestChip("");
                    }
                  }}
                  placeholder="e.g., Full Stack Web Development, Cloud Architect, Cybersecurity Specialist..."
                  disabled={aiLoading}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border text-sm sm:text-base font-medium transition-all outline-none ${
                    isDark
                      ? "bg-[#0B0F17] border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      : "bg-gray-50/50 border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  }`}
                />
                {interestInput && (
                  <button
                    type="button"
                    onClick={() => { setInterestInput(""); setSelectedInterestChip(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Suggested Interest Chips */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Or pick a popular technology domain:
              </label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.map(({ name, icon: IconComponent }) => {
                  const isSelected = selectedInterestChip === name || interestInput.toLowerCase() === name.toLowerCase();
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleChipClick(name)}
                      className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25 transform scale-[1.02]"
                          : isDark
                          ? "bg-[#0B0F17] border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-gray-800/50"
                          : "bg-gray-100/70 border-gray-200 text-gray-700 hover:bg-gray-200/60"
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-orange-500"}`} />
                      <span>{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills & Competencies Manager */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold">
                  Skills You Know or Want to Leverage
                </label>
                <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Press Enter to add skill
                </span>
              </div>

              {/* Tag pill container */}
              <div className={`p-3 rounded-xl border min-h-[52px] flex flex-wrap gap-2 items-center ${
                isDark ? "bg-[#0B0F17] border-gray-700" : "bg-gray-50/50 border-gray-300"
              }`}>
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold border ${
                      isDark
                        ? "bg-gray-800 text-orange-400 border-gray-700"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center flex-1 min-w-[150px]">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder={skillsList.length === 0 ? "e.g., Python, React, SQL, AWS..." : "+ add another skill"}
                    className="bg-transparent border-none text-xs sm:text-sm outline-none w-full px-2 py-1 placeholder-gray-500"
                  />
                  {customSkillInput && (
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="p-1 rounded bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Current Experience Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map((lvl) => {
                  const isChecked = experienceLevel === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                        isChecked
                          ? isDark
                            ? "border-orange-500 bg-orange-500/10 ring-1 ring-orange-500"
                            : "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                          : isDark
                          ? "border-gray-800 bg-[#0B0F17] hover:border-gray-700"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{lvl.label}</span>
                        {isChecked && <Check className="w-4 h-4 text-orange-500" />}
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {lvl.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                disabled={aiLoading}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center space-x-2.5 ${
                  aiLoading
                    ? "bg-gray-600 cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                <Sparkles className={`w-5 h-5 ${aiLoading ? "animate-spin" : ""}`} />
                <span>{aiLoading ? "Generating Your Plan..." : "Generate My Career Plan"}</span>
              </button>

              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Powered by Local Llama &amp; Gemini AI models
              </span>
            </div>
          </form>
        </section>

        {/* ── Section D: AI Generation / Loading Experience ─────────────── */}
        {aiLoading && (
          <section className={`rounded-2xl border p-8 sm:p-12 text-center transition-all ${
            isDark ? "bg-[#131B26] border-gray-800" : "bg-white border-gray-200 shadow-lg"
          }`}>
            <div className="max-w-md mx-auto space-y-6">
              {/* Animated pulsating radar/sparkle orb */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 opacity-20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full border-2 border-orange-500/40 flex items-center justify-center bg-orange-500/10 backdrop-blur-sm">
                  <Sparkles className="w-10 h-10 text-orange-500 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  {loadingStep === 0 && "Analyzing your skills & profile..."}
                  {loadingStep === 1 && "Benchmarking industry career requirements..."}
                  {loadingStep === 2 && "Synthesizing step-by-step career roadmaps..."}
                </h3>
                <p className={`text-sm mt-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Our AI is formulating tailored roles, skill gaps, and curated learning resources.
                </p>
              </div>

              {/* Progress bar stages */}
              <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 transition-all duration-700 rounded-full"
                  style={{ width: `${(loadingStep + 1) * 33}%` }}
                />
              </div>

              {/* Skeleton cards preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 opacity-40">
                <div className={`p-4 rounded-xl border animate-pulse space-y-3 ${isDark ? "border-gray-800 bg-[#0B0F17]" : "border-gray-200 bg-gray-50"}`}>
                  <div className="h-4 bg-gray-600/40 rounded w-3/4" />
                  <div className="h-3 bg-gray-600/30 rounded w-1/2" />
                  <div className="h-10 bg-gray-600/20 rounded w-full" />
                </div>
                <div className={`p-4 rounded-xl border animate-pulse space-y-3 hidden sm:block ${isDark ? "border-gray-800 bg-[#0B0F17]" : "border-gray-200 bg-gray-50"}`}>
                  <div className="h-4 bg-gray-600/40 rounded w-3/4" />
                  <div className="h-3 bg-gray-600/30 rounded w-1/2" />
                  <div className="h-10 bg-gray-600/20 rounded w-full" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Error Banner ──────────────────────────────────────────────── */}
        {aiError && !aiLoading && (
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? "bg-red-950/20 border-red-900/60 text-red-300" : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Recommendation Generation Issue</h4>
                <p className="text-xs sm:text-sm mt-0.5">{aiError}</p>
              </div>
            </div>
            <button
              onClick={handleGenerateCustomPlan}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white self-start sm:self-center transition-colors shadow-sm"
            >
              Retry Generation
            </button>
          </div>
        )}

        {/* ── Section E: Career Recommendation Results ──────────────────── */}
        {!aiLoading && recommendations.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-gray-700/40">
              <div>
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Briefcase className="w-6 h-6 text-orange-500" />
                  <span>Personalized Career Recommendations</span>
                </h2>
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Showing {recommendations.length} recommended paths ranked by profile alignment and market demand.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleGenerateCustomPlan}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    isDark
                      ? "border-gray-800 bg-[#131B26] hover:bg-gray-800 text-gray-300"
                      : "border-gray-200 bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                  <span>Refresh Recommendations</span>
                </button>
              </div>
            </div>

            {/* Recommendation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <CareerRecommendationCard
                  key={`${rec.careerTitle}-${idx}`}
                  rec={rec}
                  idx={idx}
                  isDark={isDark}
                  onExplore={() => setSelectedCareerModal(rec)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {!aiLoading && recommendations.length === 0 && !aiError && (
          <section className={`rounded-2xl border p-12 text-center ${
            isDark ? "bg-[#131B26] border-gray-800" : "bg-white border-gray-200 shadow-sm"
          }`}>
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold">Ready to map your future career?</h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Enter a career interest above or choose from popular technology domains to generate your custom AI career analysis, role fit, and learning roadmap.
              </p>
              <button
                onClick={scrollToInput}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all text-sm"
              >
                <span>Select an Interest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ── Section F, G, H: Detailed Career Roadmap Modal ──────────────── */}
      {selectedCareerModal && (
        <CareerDetailModal
          rec={selectedCareerModal}
          isDark={isDark}
          onClose={() => setSelectedCareerModal(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Career Recommendation Card (Section E)
// ─────────────────────────────────────────────────────────────────────────────
function CareerRecommendationCard({ rec, idx, isDark, onExplore }) {
  const title = rec.careerTitle || "Technology Career Path";
  const fitScore = rec.fitScore ? Number(rec.fitScore) || rec.fitScore : "85";
  const strengths = rec.strengthsForThisCareer || rec.strengths || [];
  const gaps = rec.gapsToAddress || rec.gaps || [];
  const courses = rec.recommendedCourses || [];
  const skillActions = rec.skillActions || [];

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? "bg-[#131B26] border-gray-800 hover:border-orange-500/40 shadow-lg shadow-black/40"
          : "bg-white border-gray-200/90 hover:border-orange-400 shadow-md hover:shadow-xl shadow-slate-200/50"
      }`}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              Path #{idx + 1}
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-snug mt-0.5">
              {title}
            </h3>
          </div>

          {/* Fit Score Badge */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {typeof fitScore === "number" ? `${fitScore}% Fit` : fitScore}
            </span>
            <span className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Role Alignment
            </span>
          </div>
        </div>

        {/* Strengths Chips */}
        {strengths.length > 0 && (
          <div>
            <span className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
              💪 Your Current Strengths
            </span>
            <div className="flex flex-wrap gap-1.5">
              {strengths.slice(0, 3).map((st, i) => (
                <span
                  key={i}
                  className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {st}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gaps to Address */}
        {gaps.length > 0 && (
          <div>
            <span className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-amber-400" : "text-amber-700"}`}>
              📚 Skills to Develop
            </span>
            <div className="flex flex-wrap gap-1.5">
              {gaps.slice(0, 3).map((gp, i) => (
                <span
                  key={i}
                  className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${
                    isDark
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {gp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Courses preview */}
        {courses.length > 0 && (
          <div className={`pt-3 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <span className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              🎓 Recommended Course
            </span>
            <p className="text-xs font-medium truncate">
              {courses[0]?.name || courses[0]?.title || "Industry Specialization Course"}
              {courses[0]?.platform && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                  isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                }`}>
                  {courses[0].platform}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={onExplore}
        className="mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5 group"
      >
        <span>Explore Career &amp; Roadmap</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Career Details & Roadmap Modal (Sections F, G, H)
// ─────────────────────────────────────────────────────────────────────────────
function CareerDetailModal({ rec, isDark, onClose }) {
  const [activeTab, setActiveTab] = useState("roadmap"); // 'roadmap' | 'skills' | 'courses' | 'materials'

  const title = rec.careerTitle || "Career Path";
  const fitScore = rec.fitScore ? Number(rec.fitScore) || rec.fitScore : "85";
  const roadmap = rec.roadmap || [];
  const strengths = rec.strengthsForThisCareer || rec.strengths || [];
  const gaps = rec.gapsToAddress || rec.gaps || [];
  const skillActions = rec.skillActions || [];
  const courses = rec.recommendedCourses || [];
  const materials = rec.trainingMaterials || [];
  const youtubeVideos = rec.youtubeVideos || [];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden transition-all my-auto ${
          isDark ? "bg-[#131B26] border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-start justify-between gap-4 ${isDark ? "border-gray-800 bg-[#0E1520]" : "border-gray-200 bg-gray-50/80"}`}>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                Career Roadmap Dossier
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Fit: {typeof fitScore === "number" ? `${fitScore}%` : fitScore}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className={`p-2 rounded-xl transition-colors ${
              isDark ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={`flex border-b px-6 space-x-4 overflow-x-auto ${isDark ? "border-gray-800 bg-[#131B26]" : "border-gray-200 bg-white"}`}>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`py-3 px-2 border-b-2 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "roadmap"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Learning Roadmap ({roadmap.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`py-3 px-2 border-b-2 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "skills"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Skill Analysis &amp; Actions</span>
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`py-3 px-2 border-b-2 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "courses"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("materials")}
            className={`py-3 px-2 border-b-2 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeTab === "materials"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Resources &amp; Videos ({materials.length + youtubeVideos.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: ROADMAP (Section G) */}
          {activeTab === "roadmap" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Compass className="w-5 h-5 text-orange-500" />
                <span>Structured Phase-by-Phase Roadmap</span>
              </h3>

              {roadmap.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-orange-500/30">
                  {roadmap.map((phase, i) => (
                    <div key={i} className="relative group">
                      {/* Step marker */}
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-orange-500/30">
                        {i + 1}
                      </div>

                      <div className={`p-4 rounded-xl border transition-all ${
                        isDark ? "bg-[#0E1520] border-gray-800" : "bg-gray-50 border-gray-200"
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <h4 className="font-bold text-base text-orange-500">
                            {phase.phase || `Phase ${i + 1}`}: {phase.title || "Foundations"}
                          </h4>
                        </div>

                        {Array.isArray(phase.actions) && phase.actions.length > 0 ? (
                          <ul className="space-y-1.5 mt-2">
                            {phase.actions.map((act, j) => (
                              <li key={j} className="text-xs sm:text-sm flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className={isDark ? "text-gray-300" : "text-gray-700"}>{act}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-500">Focus on foundational concepts and practical labs.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  No specific phased roadmap steps were returned for this role.
                </p>
              )}
            </div>
          )}

          {/* TAB 2: SKILLS & ACTIONS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className={`p-4 rounded-xl border ${isDark ? "bg-emerald-950/10 border-emerald-900/30" : "bg-emerald-50/50 border-emerald-200"}`}>
                  <h4 className="font-bold text-sm text-emerald-600 flex items-center space-x-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Strengths for this Career</span>
                  </h4>
                  {strengths.length > 0 ? (
                    <ul className="space-y-1">
                      {strengths.map((s, idx) => (
                        <li key={idx} className="text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                          <span>•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">No overlapping strengths identified yet.</p>
                  )}
                </div>

                {/* Gaps */}
                <div className={`p-4 rounded-xl border ${isDark ? "bg-amber-950/10 border-amber-900/30" : "bg-amber-50/50 border-amber-200"}`}>
                  <h4 className="font-bold text-sm text-amber-600 flex items-center space-x-1.5 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Skills to Prioritize</span>
                  </h4>
                  {gaps.length > 0 ? (
                    <ul className="space-y-1">
                      {gaps.map((g, idx) => (
                        <li key={idx} className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center space-x-1.5">
                          <span>•</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">Profile matches the required competency baseline.</p>
                  )}
                </div>
              </div>

              {/* Actionable Project / Skill tasks */}
              {skillActions.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-3 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>Practical Skill Actions &amp; Project Ideas</span>
                  </h4>
                  <div className="space-y-2">
                    {skillActions.map((action, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start space-x-2.5 ${
                          isDark ? "bg-[#0E1520] border-gray-800 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-800"
                        }`}
                      >
                        <span className="font-bold text-orange-500">{idx + 1}.</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COURSES (Section H) */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-orange-500" />
                <span>Recommended Curated Courses</span>
              </h3>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((course, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        isDark ? "bg-[#0E1520] border-gray-800" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div>
                        {course.platform && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 text-orange-500">
                            {course.platform}
                          </span>
                        )}
                        <h4 className="font-bold text-sm sm:text-base mt-1.5">
                          {course.name || course.title || "Industry Specialization Course"}
                        </h4>
                      </div>

                      {course.link && (
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors pt-2"
                        >
                          <span>Go to Course</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  No specific courses available for this recommendation.
                </p>
              )}
            </div>
          )}

          {/* TAB 4: MATERIALS & VIDEOS */}
          {activeTab === "materials" && (
            <div className="space-y-6">
              {/* Training Materials */}
              {materials.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-3 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>Documentation &amp; Practical Labs</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {materials.map((mat, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          isDark ? "bg-[#0E1520] border-gray-800" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{mat.type || "Guide"}</span>
                          <p className="font-bold text-xs sm:text-sm">{mat.name || mat.title || "Resource"}</p>
                        </div>
                        {mat.link && (
                          <a
                            href={mat.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube Channels / Videos */}
              {youtubeVideos.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-3 flex items-center space-x-2">
                    <PlayCircle className="w-4 h-4 text-red-500" />
                    <span>Recommended Video Tutorials</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {youtubeVideos.map((vid, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          isDark ? "bg-[#0E1520] border-gray-800" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <PlayCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="font-bold text-xs sm:text-sm">{vid.title || "Video Channel"}</span>
                        </div>
                        {vid.link && (
                          <a
                            href={vid.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {materials.length === 0 && youtubeVideos.length === 0 && (
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  No additional training materials or videos provided for this career path.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-end ${isDark ? "border-gray-800 bg-[#0E1520]" : "border-gray-200 bg-gray-50/80"}`}>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AICareerGuide;
