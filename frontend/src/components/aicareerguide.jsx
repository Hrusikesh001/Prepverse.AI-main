import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import server from "../environment";

const FLASK_API = "http://127.0.0.1:5000/api";

function AICareerGuide() {
  const { authUser } = useAuth();

  const [resumeData, setResumeData]           = useState(null);
  const [resumeLoading, setResumeLoading]     = useState(true);
  const [resumeError, setResumeError]         = useState("");

  const [recommendations, setRecommendations] = useState([]);
  const [aiLoading, setAiLoading]             = useState(false);
  const [aiError, setAiError]                 = useState("");

  const [search, setSearch]     = useState("");
  const [modalData, setModalData] = useState(null);

  // ── Styles ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
    .cag-wrap * { margin: 0; padding: 0; box-sizing: border-box; }
    .cag-wrap { font-family: 'ProximaNova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #18191A; min-height: 100vh; color: #FFF; }
    .cag-orange { color: #FC8019; font-weight: bold; }
    .cag-white  { color: #FFFFFF; font-weight: bold; }

    /* Navbar */
    .cag-navbar { background: #212124; padding: 0 2rem; box-shadow: 0 1px 8px rgba(0,0,0,.3); position: sticky; top: 0; z-index: 100; border-bottom: 2px solid #FC8019; }
    .cag-nav-content { max-width: 1400px; margin: 0 auto; height: 70px; display: flex; justify-content: space-between; align-items: center; }
    .cag-logo { font-size: 1.5rem; font-weight: 800; color: #FC8019; display: flex; align-items: center; gap: .5rem; }
    .cag-user-badge { background: #2A2A2A; color: #FFF; padding: .5rem 1rem; border-radius: 4px; font-size: .875rem; font-weight: 600; }

    /* Main */
    .cag-main { max-width: 1400px; margin: 0 auto; padding: 2.5rem 2rem; }

    /* Status banners */
    .cag-banner { border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: .75rem; font-size: .95rem; font-weight: 500; }
    .cag-banner-warn  { background: rgba(252,128,25,.12); border: 1px solid rgba(252,128,25,.35); color: #FC8019; }
    .cag-banner-error { background: rgba(220,38,38,.12);  border: 1px solid rgba(220,38,38,.35);  color: #f87171; }
    .cag-banner-info  { background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.35); color: #93c5fd; }

    /* Profile strip */
    .cag-profile-strip { background: #212124; border-radius: 10px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #333; }
    .cag-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #FC8019; }
    .cag-profile-info h3 { font-size: 1rem; font-weight: 700; color: #FFF; }
    .cag-profile-info p  { font-size: .8rem; color: #AAA; margin-top: .15rem; }
    .cag-resume-tags { margin-left: auto; display: flex; flex-wrap: wrap; gap: .4rem; }
    .cag-resume-tag { background: #2A2A2A; color: #FC8019; border: 1px solid #FC8019; padding: .25rem .65rem; border-radius: 4px; font-size: .75rem; font-weight: 600; }

    /* Hero */
    .cag-hero { text-align: center; margin-bottom: 2rem; }
    .cag-hero h2 { font-size: 2.25rem; font-weight: 800; color: #FFF; margin-bottom: .4rem; }
    .cag-hero p  { font-size: 1.05rem; color: #AAA; }

    /* Search */
    .cag-search-wrap { max-width: 700px; margin: 0 auto 2.5rem; position: relative; }
    .cag-search-input { width: 100%; padding: 1rem 3.5rem; font-size: 1rem; border: 1px solid #555; border-radius: 6px; background: #2A2A2A; color: #FFF; transition: all .3s; }
    .cag-search-input:focus { outline: none; border-color: #FC8019; box-shadow: 0 0 0 2px rgba(252,128,25,.2); }
    .cag-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #AAA; }
    .cag-ai-btn { position: absolute; right: .5rem; top: 50%; transform: translateY(-50%); background: #FC8019; color: #FFF; border: none; padding: .625rem .75rem; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: .4rem; font-size: .85rem; font-weight: 700; transition: all .3s; }
    .cag-ai-btn:hover { background: #FF5200; }
    .cag-ai-btn:disabled { opacity: .6; cursor: not-allowed; }

    /* Section */
    .cag-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .cag-section-title  { font-size: 1.5rem; font-weight: 800; color: #FFF; }
    .cag-refresh-btn { background: transparent; border: 1px solid #555; color: #AAA; padding: .45rem .9rem; border-radius: 5px; cursor: pointer; font-size: .8rem; transition: all .3s; }
    .cag-refresh-btn:hover { border-color: #FC8019; color: #FC8019; }

    /* Loading spinner */
    .cag-spinner-wrap { text-align: center; padding: 4rem 1rem; }
    .cag-spinner { border: 4px solid #2A2A2A; border-top: 4px solid #FC8019; border-radius: 50%; width: 52px; height: 52px; animation: cagSpin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes cagSpin { 0%{ transform: rotate(0deg);} 100%{ transform: rotate(360deg);} }
    .cag-spinner-text { color: #AAA; font-size: 1rem; font-weight: 600; }

    /* Cards grid */
    .cag-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem; }
    .cag-card { background: #2A2A2A; border-radius: 10px; padding: 1.75rem; box-shadow: 0 2px 8px rgba(0,0,0,.3); transition: all .3s; animation: cagFadeIn .5s ease-out; border: 1px solid transparent; }
    @keyframes cagFadeIn { from{ opacity:0; transform:translateY(20px);} to{ opacity:1; transform:translateY(0);} }
    .cag-card:hover { box-shadow: 0 4px 20px rgba(252,128,25,.15); transform: translateY(-3px); border-color: rgba(252,128,25,.25); }
    .cag-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; gap: 1rem; }
    .cag-card-title  { font-size: 1.25rem; font-weight: 700; color: #FFF; flex: 1; line-height: 1.3; }
    .cag-fit-badge   { background: #FC8019; color: #FFF; padding: .35rem .8rem; border-radius: 4px; font-weight: 700; font-size: .875rem; white-space: nowrap; }
    .cag-card-section { margin-bottom: 1.1rem; }
    .cag-card-section-title { font-size: .8rem; font-weight: 700; color: #FC8019; margin-bottom: .5rem; text-transform: uppercase; letter-spacing: .5px; }
    .cag-tag-list { display: flex; flex-wrap: wrap; gap: .4rem; }
    .cag-tag { background: #3A3A3A; color: #FFF; padding: .3rem .65rem; border-radius: 4px; font-size: .8rem; font-weight: 600; }
    .cag-action-list { list-style: none; padding: 0; }
    .cag-action-list li { padding: .5rem 0; color: #CCC; font-size: .875rem; border-bottom: 1px solid #3A3A3A; }
    .cag-action-list li:last-child { border-bottom: none; }
    .cag-action-list li::before { content: "▸"; color: #FC8019; margin-right: .5rem; font-weight: bold; }
    .cag-view-btn { width: 100%; padding: .85rem; background: #FC8019; color: #FFF; border: none; border-radius: 5px; font-weight: 700; cursor: pointer; transition: all .3s; margin-top: .5rem; font-size: .875rem; text-transform: uppercase; letter-spacing: .5px; }
    .cag-view-btn:hover { background: #FF5200; box-shadow: 0 4px 12px rgba(252,128,25,.4); }

    /* Empty state */
    .cag-empty { text-align: center; padding: 4rem 1rem; color: #666; }
    .cag-empty svg { width: 56px; height: 56px; margin: 0 auto 1rem; opacity: .4; }
    .cag-empty p { font-size: 1rem; }

    /* Modal */
    .cag-modal-overlay  { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 2rem; overflow-y: auto; }
    .cag-modal-content  { background: #212124; border-radius: 10px; padding: 2.5rem; max-width: 820px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    .cag-modal-close    { position: absolute; top: 1rem; right: 1rem; background: #3A3A3A; color: #FFF; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 1.5rem; line-height: 1; transition: all .3s; }
    .cag-modal-close:hover { background: #FC8019; }
    .cag-modal-title    { font-size: 1.875rem; font-weight: 800; color: #FFF; margin-bottom: .5rem; }
    .cag-modal-section  { margin-bottom: 2rem; }
    .cag-modal-section h3 { font-size: 1.125rem; font-weight: 700; color: #FFF; margin-bottom: 1rem; }
    .cag-roadmap-phase  { background: #2A2A2A; padding: 1.25rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #FC8019; }
    .cag-roadmap-phase h4 { font-size: 1rem; font-weight: 700; color: #FFF; margin-bottom: .6rem; }
    .cag-roadmap-phase ul { list-style: none; padding: 0; }
    .cag-roadmap-phase li { padding: .4rem 0; color: #CCC; font-size: .875rem; }
    .cag-roadmap-phase li::before { content: "✓"; color: #FC8019; margin-right: .5rem; }
    .cag-resource-item { background: #2A2A2A; padding: 1rem; border-radius: 8px; margin-bottom: .75rem; }
    .cag-resource-item strong { color: #FFF; display: block; margin-bottom: .2rem; }
    .cag-resource-item span   { color: #AAA; font-size: .85rem; }
    .cag-resource-item a      { color: #FC8019; text-decoration: none; font-weight: 600; font-size: .85rem; }
    .cag-resource-item a:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .cag-hero h2 { font-size: 1.75rem; }
      .cag-cards-grid { grid-template-columns: 1fr; }
      .cag-profile-strip { flex-direction: column; align-items: flex-start; }
      .cag-resume-tags { margin-left: 0; }
    }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ── Fetch resume data from Node.js backend on mount ───────────────────────
  useEffect(() => {
    const fetchResume = async () => {
      setResumeLoading(true);
      setResumeError("");
      try {
        const { data } = await axios.post(
          `${server}/resume-upload/getResumeData`,
          {},
          { withCredentials: true }
        );
        if (data.resume_data && data.resume_data.resumeJSONdata) {
          setResumeData(data.resume_data.resumeJSONdata);
        } else {
          setResumeError("No resume found. Please upload your resume in Profile to get personalised recommendations.");
        }
      } catch {
        setResumeError("Could not load resume data. Please make sure you are logged in and have uploaded a resume.");
      }
      setResumeLoading(false);
    };
    fetchResume();
  }, []);

  // ── Auto-fetch recommendations once resume is loaded ──────────────────────
  useEffect(() => {
    if (resumeData) {
      fetchRecommendations(resumeData);
    }
  }, [resumeData]);

  // ── AI Recommendations from resume ────────────────────────────────────────
  const fetchRecommendations = async (rd) => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch(`${FLASK_API}/recommend-by-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: rd }),
      });
      const data = await response.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setAiError(data.error || "Could not generate recommendations. Make sure the AI server is running.");
      }
    } catch {
      setAiError("Cannot reach the AI service (http://127.0.0.1:5000). Please make sure the Python backend is running.");
    }
    setAiLoading(false);
  };

  // ── AI Guidance from interest + resume ────────────────────────────────────
  const handleSearchAI = async () => {
    if (!search.trim()) {
      alert("Please enter a career interest to search.");
      return;
    }
    if (!resumeData) {
      alert("Resume data is not loaded yet. Please wait or upload your resume first.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch(`${FLASK_API}/guidance-by-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, interest: search }),
      });
      const data = await response.json();
      if (data.success && data.guidance) {
        setRecommendations(data.guidance);
        setSearch("");
      } else {
        setAiError(data.error || "Unable to generate guidance. Please try again.");
      }
    } catch {
      setAiError("Error connecting to AI service.");
    }
    setAiLoading(false);
  };

  const handleViewRoadmap = (rec) => setModalData(rec);

  // ── Derive skill tags to show in profile strip ────────────────────────────
  const getSkillTags = () => {
    if (!resumeData) return [];
    const raw = resumeData.skills || [];
    const items = [];
    raw.forEach((cat) => {
      if (cat && cat.items) items.push(...cat.items.slice(0, 2));
    });
    return items.slice(0, 5);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="cag-wrap">
      {/* Navbar */}
      <nav className="cag-navbar">
        <div className="cag-nav-content">
          <div className="cag-logo">
            <span className="cag-orange">Career Advisor</span>
            <span className="cag-white">AI</span>
          </div>
          {authUser && (
            <span className="cag-user-badge">
              👤 {authUser.user?.name || authUser.user?.username || "User"}
            </span>
          )}
        </div>
      </nav>

      <div className="cag-main">
        {/* Resume loading / error banners */}
        {resumeLoading && (
          <div className="cag-banner cag-banner-info">
            <span>⏳</span> Loading your resume data…
          </div>
        )}
        {!resumeLoading && resumeError && (
          <div className="cag-banner cag-banner-warn">
            <span>⚠️</span> {resumeError}
          </div>
        )}
        {aiError && (
          <div className="cag-banner cag-banner-error">
            <span>❌</span> {aiError}
          </div>
        )}

        {/* Profile strip – show once resume is loaded */}
        {!resumeLoading && resumeData && authUser && (
          <div className="cag-profile-strip">
            {authUser.user?.profilePicURL ? (
              <img
                src={authUser.user.profilePicURL}
                alt="avatar"
                className="cag-avatar"
              />
            ) : (
              <div className="cag-avatar" style={{ background: "#FC8019", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                {(authUser.user?.name || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="cag-profile-info">
              <h3>{authUser.user?.name || authUser.user?.username}</h3>
              <p>{authUser.user?.email}</p>
            </div>
            <div className="cag-resume-tags">
              {getSkillTags().map((s, i) => (
                <span key={i} className="cag-resume-tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Hero */}
        <div className="cag-hero">
          <h2>Your Personalized Career Roadmap</h2>
          <p>AI-powered recommendations based on your resume &amp; profile</p>
        </div>

        {/* Search */}
        <div className="cag-search-wrap">
          <svg className="cag-search-icon" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="cag-search-input"
            placeholder="Explore a specific career interest (e.g. 'blockchain', 'data science')…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchAI()}
            disabled={aiLoading}
          />
          <button className="cag-ai-btn" onClick={handleSearchAI} disabled={aiLoading || !resumeData}>
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ask AI
          </button>
        </div>

        {/* Recommendations section */}
        <div className="cag-section-header">
          <h3 className="cag-section-title">Recommended for You</h3>
          {resumeData && !aiLoading && (
            <button className="cag-refresh-btn" onClick={() => fetchRecommendations(resumeData)}>
              🔄 Regenerate
            </button>
          )}
        </div>

        {/* Loading spinner */}
        {aiLoading && (
          <div className="cag-spinner-wrap">
            <div className="cag-spinner" />
            <p className="cag-spinner-text">Analysing your profile with AI…</p>
          </div>
        )}

        {/* Cards */}
        {!aiLoading && recommendations.length > 0 && (
          <div className="cag-cards-grid">
            {recommendations.map((rec, idx) => (
              <CareerCard key={idx} rec={rec} idx={idx} onViewRoadmap={handleViewRoadmap} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!aiLoading && recommendations.length === 0 && !aiError && !resumeLoading && (
          <div className="cag-empty">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>
              {resumeError
                ? "Upload your resume in Profile to unlock AI career recommendations."
                : "No recommendations yet. Make sure the AI server is running, then click Regenerate."}
            </p>
          </div>
        )}
      </div>

      {/* Roadmap modal */}
      {modalData && (
        <RecommendationModal rec={modalData} onClose={() => setModalData(null)} />
      )}
    </div>
  );
}

// ── Career Card ──────────────────────────────────────────────────────────────
function CareerCard({ rec, idx, onViewRoadmap }) {
  const strengths = rec.strengthsForThisCareer || rec.strengths || [];
  const gaps      = rec.gapsToAddress || rec.gaps || [];
  const courses   = rec.recommendedCourses || [];
  const fit       = rec.fitScore || "N/A";
  return (
    <div className="cag-card" style={{ animationDelay: `${idx * 0.1}s` }}>
      <div className="cag-card-header">
        <h3 className="cag-card-title">{rec.careerTitle || "Career Path"}</h3>
        <span className="cag-fit-badge">{fit}</span>
      </div>
      {strengths.length > 0 && (
        <div className="cag-card-section">
          <div className="cag-card-section-title">💪 Your Strengths</div>
          <div className="cag-tag-list">
            {strengths.slice(0, 4).map((s, i) => (
              <span className="cag-tag" key={i}>{s}</span>
            ))}
          </div>
        </div>
      )}
      {gaps.length > 0 && (
        <div className="cag-card-section">
          <div className="cag-card-section-title">📚 Skills to Develop</div>
          <div className="cag-tag-list">
            {gaps.slice(0, 4).map((g, i) => (
              <span className="cag-tag" key={i}>{g}</span>
            ))}
          </div>
        </div>
      )}
      {courses.length > 0 && (
        <div className="cag-card-section">
          <div className="cag-card-section-title">🎓 Top Courses</div>
          <ul className="cag-action-list">
            {courses.slice(0, 3).map((c, i) => (
              <li key={i}>
                {c.name || c.title || "Course"}{c.platform ? ` (${c.platform})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="cag-view-btn" onClick={() => onViewRoadmap(rec)}>
        VIEW ROADMAP
      </button>
    </div>
  );
}

// ── Roadmap Modal ────────────────────────────────────────────────────────────
function RecommendationModal({ rec, onClose }) {
  const roadmap   = rec.roadmap || [];
  const courses   = rec.recommendedCourses || [];
  const materials = rec.trainingMaterials || [];
  return (
    <div className="cag-modal-overlay" onClick={onClose}>
      <div className="cag-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cag-modal-close" onClick={onClose}>×</button>
        <h2 className="cag-modal-title">{rec.careerTitle || "Career Path"}</h2>

        {roadmap.length > 0 && (
          <div className="cag-modal-section">
            <h3>📍 Complete Roadmap</h3>
            {roadmap.map((phase, i) => (
              <div className="cag-roadmap-phase" key={i}>
                <h4>{phase.phase || "Phase"}: {phase.title || ""}</h4>
                {Array.isArray(phase.actions) && (
                  <ul>
                    {phase.actions.map((action, j) => <li key={j}>{action}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {courses.length > 0 && (
          <div className="cag-modal-section">
            <h3>🎓 Recommended Courses</h3>
            {courses.map((course, i) => (
              <div className="cag-resource-item" key={i}>
                <strong>{course.name || course.title || "Course"}</strong>
                <span>{course.platform || ""}</span>
                {course.link && (
                  <><br /><a href={course.link} target="_blank" rel="noopener noreferrer">View Course →</a></>
                )}
              </div>
            ))}
          </div>
        )}

        {materials.length > 0 && (
          <div className="cag-modal-section">
            <h3>📖 Training Materials</h3>
            {materials.map((material, i) => (
              <div className="cag-resource-item" key={i}>
                <strong>{material.name || material.title || "Resource"}</strong>
                <span>{material.type || ""}</span>
                {material.link && (
                  <><br /><a href={material.link} target="_blank" rel="noopener noreferrer">Access Resource →</a></>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AICareerGuide;
