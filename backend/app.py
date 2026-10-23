
import pandas as pd
import json
import time
import requests
from requests.exceptions import Timeout, RequestException

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-this")
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)

# Enable CORS with proper configuration
CORS(app,
     supports_credentials=True,
     origins=["*"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# --- Configuration ---
# Local Ollama LLM configuration - uses llama3.2:latest by default (already pulled).
# Override via environment variables: OLLAMA_MODEL or OLLAMA_BASE_URL
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")
CSV_FILE_PATH   = "Students_Performance_information.csv"

def check_ollama():
    """Verify Ollama is reachable and the model is available (checked per-request)."""
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        if resp.status_code == 200:
            models = [m["name"] for m in resp.json().get("models", [])]
            if any(OLLAMA_MODEL in m for m in models):
                return True
            else:
                print(f"[WARN] Ollama running but model '{OLLAMA_MODEL}' not found.")
                print(f"       Run: ollama pull {OLLAMA_MODEL}")
                return False
        return False
    except Exception as e:
        print(f"[ERROR] Ollama not reachable at {OLLAMA_BASE_URL}: {e}")
        print("        Start Ollama with: ollama serve")
        return False

print(f"[INFO] Checking Ollama at startup - model: {OLLAMA_MODEL}")
if check_ollama():
    print(f"[OK]   Ollama ready - model '{OLLAMA_MODEL}' found")
else:
    print("[WARN] Ollama not ready at startup. Will retry on each request.")

# Load and prepare student data
df_students = None
try:
    df_students = pd.read_csv(CSV_FILE_PATH)
    df_students.columns = df_students.columns.str.strip()

    # Standardize Registration Number column
    reg_col = None
    for col in df_students.columns:
        if 'registration' in col.lower() and 'number' in col.lower():
            reg_col = col
            break

    if reg_col:
        df_students['RegistrationNumber'] = df_students[reg_col].astype(str).str.strip()
        df_students.set_index('RegistrationNumber', inplace=True)

    print(f"[OK]   Loaded {len(df_students)} student records from CSV")
    print(f"[INFO] Available columns: {list(df_students.columns)}")
except Exception as e:
    print(f"[ERROR] Error loading CSV: {e}")

# --- Helper Functions ---

def authenticate_user(reg_no, password):
    """Authenticate user with registration number and password from CSV"""
    if df_students is None:
        return False, "Database not loaded"

    reg_no = str(reg_no).strip()

    try:
        if reg_no not in df_students.index:
            return False, "Registration number not found"

        student_row = df_students.loc[reg_no]

        # Check if password column exists in CSV
        password_col = None
        for col in df_students.columns:
            if 'password' in col.lower():
                password_col = col
                break

        if password_col and str(student_row[password_col]).strip() == str(password).strip():
            return True, "Success"
        elif not password_col:
            # If no password column, use registration number as default password
            if str(password).strip() == reg_no:
                return True, "Success"

        return False, "Invalid password"
    except Exception as e:
        return False, f"Authentication error: {str(e)}"


def extract_student_profile(reg_no):
    """Extract complete student profile from CSV"""
    try:
        student_data = df_students.loc[reg_no].to_dict()

        # Clean and organize data
        profile = {}
        for key, value in student_data.items():
            if pd.notna(value):
                profile[key] = str(value)

        return profile
    except Exception as e:
        print(f"Error extracting profile: {e}")
        return None


def filter_student_profile(profile):
    """Keep only fields relevant to career growth to optimize LLM performance."""
    essential_fields = [
        "Program", "Current Semester", "What are the skills do you have ?",
        "What is you interested area?", "What is your current CGPA?",
        "Are you engaged with any co-curriculum activities?",
        "Status of your English language proficiency",
        "How many hour do you spent daily on your skill development?",
        "Do you have meritorious scholarship ?", "Average attendance on class"
    ]
    return {k: v for k, v in profile.items() if k in essential_fields}


def get_fallback_recommendations(profile):
    """Provides base recommendations if AI service is unavailable or slow."""
    interest = profile.get("What is you interested area?", "Software").lower()
    
    if "web" in interest or "full stack" in interest:
        return [
            {
                "careerTitle": "Frontend Developer (Fallback)",
                "fitScore": 85,
                "strengthsForThisCareer": ["HTML/CSS/JS knowledge", "Interest in design"],
                "gapsToAddress": ["React/Next.js", "State Management"],
                "recommendedCourses": [{"name": "Modern React with Redux", "link": "https://www.udemy.com/course/react-redux/", "platform": "Udemy"}],
                "trainingMaterials": [{"name": "MDN Web Docs", "link": "https://developer.mozilla.org/", "type": "Documentation"}],
                "skillActions": ["Build 5 mini projects", "Learn CSS Grid/Flexbox"],
                "roadmap": [{"phase": "Month 1", "title": "Advanced JS", "actions": ["ES6+", "Async/Await"]}],
                "youtubeVideos": [{"title": "Web Dev Simplified", "link": "https://youtube.com/c/WebDevSimplified"}]
            },
            {
                "careerTitle": "Full Stack Engineer (Fallback)",
                "fitScore": 80,
                "strengthsForThisCareer": ["Versatility", "Problem Solving"],
                "gapsToAddress": ["Backend Databases", "Deployment"],
                "recommendedCourses": [{"name": "Full Stack Open", "link": "https://fullstackopen.com/", "platform": "University of Helsinki"}],
                "trainingMaterials": [{"name": "roadmap.sh", "link": "https://roadmap.sh/full-stack", "type": "Guide"}],
                "skillActions": ["Learn Node.js", "Master MongoDB"],
                "roadmap": [{"phase": "Month 1", "title": "Backend Basics", "actions": ["Express.js", "REST APIs"]}],
                "youtubeVideos": [{"title": "Traversy Media", "link": "https://youtube.com/c/TraversyMedia"}]
            },
            {
                "careerTitle": "UI/UX Designer (Fallback)",
                "fitScore": 75,
                "strengthsForThisCareer": ["Visual creativity", "User empathy"],
                "gapsToAddress": ["Prototyping tools", "User research"],
                "recommendedCourses": [{"name": "Google UX Design Professional Certificate", "link": "https://www.coursera.org/professional-certificates/google-ux-design", "platform": "Coursera"}],
                "trainingMaterials": [{"name": "NNGroup Articles", "link": "https://www.nngroup.com/articles/", "type": "Research"}],
                "skillActions": ["Learn Figma", "Conduct a usability test"],
                "roadmap": [{"phase": "Month 1", "title": "Design Thinking", "actions": ["Wireframing", "Color Theory"]}],
                "youtubeVideos": [{"title": "Flux Academy", "link": "https://youtube.com/c/FluxAcademy"}]
            }
        ]
    elif "data" in interest or "machine" in interest or "ai" in interest:
        return [
            {
                "careerTitle": "Data Scientist (Fallback)",
                "fitScore": 82,
                "strengthsForThisCareer": ["Analytical skills", "Mathematical background"],
                "gapsToAddress": ["Advanced Statistics", "Machine Learning models"],
                "recommendedCourses": [{"name": "Applied Data Science with Python", "link": "https://www.coursera.org/specializations/data-science-python", "platform": "Coursera"}],
                "trainingMaterials": [{"name": "Kaggle Tutorials", "link": "https://www.kaggle.com/learn", "type": "Interactive"}],
                "skillActions": ["Learn Pandas/NumPy", "Practice on Kaggle"],
                "roadmap": [{"phase": "Month 1", "title": "Stats & Prob", "actions": ["Hypothesis Testing", "Regression"]}],
                "youtubeVideos": [{"title": "StatQuest", "link": "https://youtube.com/c/joshstarmer"}]
            },
            {
                "careerTitle": "Machine Learning Engineer (Fallback)",
                "fitScore": 78,
                "strengthsForThisCareer": ["Core Programming", "System architecture"],
                "gapsToAddress": ["Model Deployment", "Neural Networks"],
                "recommendedCourses": [{"name": "Machine Learning Specialization", "link": "https://www.coursera.org/specializations/machine-learning-introduction", "platform": "Coursera/Stanford"}],
                "trainingMaterials": [{"name": "PyTorch Docs", "link": "https://pytorch.org/docs/", "type": "Documentation"}],
                "skillActions": ["Implement a CNN", "Learn Scikit-learn"],
                "roadmap": [{"phase": "Month 1", "title": "Basic Models", "actions": ["Decision Trees", "SVMs"]}],
                "youtubeVideos": [{"title": "Sentdex", "link": "https://youtube.com/c/sentdex"}]
            },
            {
                "careerTitle": "Data Analyst (Fallback)",
                "fitScore": 88,
                "strengthsForThisCareer": ["Reporting", "Attention to detail"],
                "gapsToAddress": ["SQL proficiency", "Visualization tools"],
                "recommendedCourses": [{"name": "Google Data Analytics", "link": "https://www.coursera.org/professional-certificates/google-data-analytics", "platform": "Coursera"}],
                "trainingMaterials": [{"name": "SQLZoo", "link": "https://sqlzoo.net/", "type": "Interactive"}],
                "skillActions": ["Learn Tableau", "Master Excel Pivot Tables"],
                "roadmap": [{"phase": "Month 1", "title": "SQL Basics", "actions": ["Joins", "Aggregates"]}],
                "youtubeVideos": [{"title": "Alex The Analyst", "link": "https://youtube.com/c/AlexTheAnalyst"}]
            }
        ]
    else:
        # Default generic software engineering fallback
        return [
            {
                "careerTitle": "Software Developer (Fallback)",
                "fitScore": 80,
                "strengthsForThisCareer": ["Core Programming", "Logical Thinking"],
                "gapsToAddress": ["Data Structures", "System Design"],
                "recommendedCourses": [{"name": "CS50 Introduction to Computer Science", "link": "https://cs50.harvard.edu/x/", "platform": "edX"}],
                "trainingMaterials": [{"name": "GeeksforGeeks", "link": "https://www.geeksforgeeks.org/", "type": "Practice"}],
                "skillActions": ["Solve LeetCode problems", "Learn Version Control (Git)"],
                "roadmap": [{"phase": "Month 1", "title": "Basics", "actions": ["DSA", "Clean Code"]}],
                "youtubeVideos": [{"title": "FreeCodeCamp", "link": "https://youtube.com/c/FreeCodeCamp"}]
            },
            {
                "careerTitle": "Mobile App Developer (Fallback)",
                "fitScore": 75,
                "strengthsForThisCareer": ["Application architecture", "Performance tuning"],
                "gapsToAddress": ["Flutter/React Native", "Native APIs"],
                "recommendedCourses": [{"name": "iOS & Swift - The Complete Bootcamp", "link": "https://www.udemy.com/course/ios-13-app-development-bootcamp/", "platform": "Udemy"}],
                "trainingMaterials": [{"name": "Android Developers", "link": "https://developer.android.com/", "type": "Documentation"}],
                "skillActions": ["Build a simple calculator app", "Learn Dart/Swift"],
                "roadmap": [{"phase": "Month 1", "title": "UI Components", "actions": ["Layouts", "Navigation"]}],
                "youtubeVideos": [{"title": "The Net Ninja", "link": "https://youtube.com/c/TheNetNinja"}]
            },
            {
                "careerTitle": "Cybersecurity Analyst (Fallback)",
                "fitScore": 70,
                "strengthsForThisCareer": ["Critical thinking", "Network knowledge"],
                "gapsToAddress": ["Penetration testing", "Incident response"],
                "recommendedCourses": [{"name": "Google Cybersecurity", "link": "https://www.coursera.org/professional-certificates/google-cybersecurity", "platform": "Coursera"}],
                "trainingMaterials": [{"name": "TryHackMe", "link": "https://tryhackme.com/", "type": "Practical Labs"}],
                "skillActions": ["Learn Linux commands", "Understand Network Security"],
                "roadmap": [{"phase": "Month 1", "title": "Security Basics", "actions": ["OSI Model", "Cryptography"]}],
                "youtubeVideos": [{"title": "NetworkChuck", "link": "https://youtube.com/c/NetworkChuck"}]
            }
        ]

def call_ollama(prompt: str, system: str = "", temperature: float = 0.7) -> str:

    """Send a prompt to the local Ollama model and return the raw text response."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"{system}\n\n{prompt}" if system else prompt,
        "format": "json",
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": 1000,  # Limit length to avoid infinite generation
            "num_ctx": 4096       # Maintain enough context
        }
    }
    start_time = time.time()
    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=300   # Restored to 300s to allow for 3 detailed results
        )
        duration = time.time() - start_time
        print(f"[INFO] Ollama request took {duration:.2f} seconds")
        resp.raise_for_status()
        return resp.json().get("response", "")
    except Timeout:
        print(f"[ERROR] Ollama timed out after 240s")
        raise Timeout("AI service took too long to respond.")
    except RequestException as e:
        print(f"[ERROR] Ollama request failed: {e}")
        raise



def generate_career_recommendations(student_profile):
    """Generate personalized career recommendations using local LLM via Ollama."""
    if not check_ollama():
        print("[ERROR] Ollama is not available")
        return {"error": f"AI service unavailable. Make sure Ollama is running and '{OLLAMA_MODEL}' is pulled. Run: ollama serve && ollama pull {OLLAMA_MODEL}"}

    # Filter profile to save tokens and speed up generation
    filtered_profile = filter_student_profile(student_profile)
    profile_text = "\n".join([f"- {k}: {v}" for k, v in filtered_profile.items()])

    print(f"\n[INFO] Generating recommendations for student profile using {len(filtered_profile)} optimized fields")

    system = (
        "You are an expert AI Career Advisor. Analyze the profile and provide THREE career recommendations. "
        "Return ONLY a JSON array with exactly 3 objects. "
        "Each object schema: {careerTitle, fitScore, strengthsForThisCareer[], gapsToAddress[], "
        "recommendedCourses[{name,link,platform}], trainingMaterials[{name,link,type}], "
        "skillActions[], roadmap[{phase,title,actions[]}], youtubeVideos[{title,link}]}. "
        "Be concise to save tokens and ensure 3 paths are provided."
    )

    prompt = f"Student Profile:\n{profile_text}\n\nProvide top 3 career paths as JSON array."


    try:
        print(f"[INFO] Calling Ollama ({OLLAMA_MODEL})...")
        raw = call_ollama(prompt, system=system, temperature=0.7)
        print(f"[OK]   Ollama responded. Response length: {len(raw)}")

        recommendations = json.loads(raw)

        # Normalise: model may wrap array in a dict key
        if isinstance(recommendations, dict):
            for v in recommendations.values():
                if isinstance(v, list):
                    recommendations = v
                    break
            else:
                recommendations = [recommendations]

        print(f"[OK]   Generated {len(recommendations)} recommendations")
        return recommendations

    except Timeout:
        print("[WARN] AI service timed out. Using fallback recommendations.")
        return get_fallback_recommendations(student_profile)
    except Exception as e:
        print(f"[ERROR] Recommendation failed: {e}")
        return get_fallback_recommendations(student_profile)



def generate_personalized_guidance(student_profile, user_interest):
    """Generate guidance based on user's new interest combined with CSV data via local LLM."""
    if not check_ollama():
        return {"error": f"AI service unavailable. Make sure Ollama is running and '{OLLAMA_MODEL}' is pulled. Run: ollama serve && ollama pull {OLLAMA_MODEL}"}

    filtered_profile = filter_student_profile(student_profile)
    profile_text = "\n".join([f"- {k}: {v}" for k, v in filtered_profile.items()])

    system = (
        f'You are a specialized Career Coach. The student is interested in: "{user_interest}". '
        "Provide focused guidance using their academic background and this interest. "
        "CRITICAL: Return ONLY a single valid JSON object (not an array) with keys: "
        "careerTitle, fitScore, strengthsForThisCareer, gapsToAddress, recommendedCourses, "
        "trainingMaterials, skillActions, roadmap, youtubeVideos. "
        "Return ONLY the JSON object."
    )

    prompt = f"""\
Interest: "{user_interest}"
Profile:
{profile_text}

Create ONE focused recommendation JSON object. title: "Guidance: {user_interest}"."""

    try:
        print(f"[INFO] Calling Ollama ({OLLAMA_MODEL}) for guidance on: {user_interest}")
        raw = call_ollama(prompt, system=system, temperature=0.8)
        guidance = json.loads(raw)
        return [guidance] if isinstance(guidance, dict) else guidance

    except Exception as e:
        print(f"[ERROR] Ollama Guidance Error: {e}")
        return {"error": str(e)}


# --- Flask Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    """Handle user login with registration number and password"""
    data = request.get_json()
    reg_no = data.get('registrationNumber', '').strip()
    password = data.get('password', '').strip()

    if not reg_no or not password:
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    success, message = authenticate_user(reg_no, password)

    if success:
        session['reg_no'] = reg_no
        session.permanent = True
        return jsonify({"success": True, "message": "Login successful", "registrationNumber": reg_no})
    else:
        return jsonify({"success": False, "message": message}), 401


@app.route('/api/logout', methods=['POST'])
def logout():
    """Handle user logout"""
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully"})


@app.route('/api/profile', methods=['GET'])
def get_profile():
    """Get logged-in user's profile"""
    reg_no = session.get('reg_no')
    if not reg_no:
        return jsonify({"error": "Not authenticated"}), 401

    profile = extract_student_profile(reg_no)
    if profile:
        return jsonify({"success": True, "profile": profile})
    else:
        return jsonify({"error": "Profile not found"}), 404


@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get AI-powered career recommendations"""
    data = request.get_json()
    reg_no = data.get('registrationNumber') or session.get('reg_no')

    print(f"\n[INFO] Recommendations requested for: {reg_no}")

    if not reg_no:
        print("[ERROR] No registration number provided")
        return jsonify({"error": "Registration number required"}), 400

    profile = extract_student_profile(reg_no)
    if not profile:
        print(f"[ERROR] Profile not found for: {reg_no}")
        return jsonify({"error": "Student profile not found"}), 404

    print(f"[OK]   Profile found with {len(profile)} fields")

    recommendations = generate_career_recommendations(profile)

    if isinstance(recommendations, dict) and "error" in recommendations:
        print(f"[ERROR] Error in recommendations: {recommendations['error']}")
        return jsonify({"error": recommendations["error"]}), 500

    print(f"[OK]   Returning {len(recommendations)} recommendations")
    return jsonify({"success": True, "recommendations": recommendations})


@app.route('/api/guidance', methods=['POST'])
def get_guidance():
    """Get personalized guidance based on user's interest query"""
    data = request.get_json()
    reg_no = data.get('registrationNumber') or session.get('reg_no')
    interest = data.get('interest', '').strip()

    if not reg_no:
        return jsonify({"error": "Not authenticated"}), 401

    if not interest:
        return jsonify({"error": "Interest query required"}), 400

    profile = extract_student_profile(reg_no)
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    guidance = generate_personalized_guidance(profile, interest)

    if isinstance(guidance, dict) and "error" in guidance:
        return jsonify({"error": guidance["error"]}), 500

    return jsonify({"success": True, "guidance": guidance})


@app.route('/api/recommend-by-resume', methods=['POST'])
def recommend_by_resume():
    """Get AI-powered career recommendations directly from resume JSON data (no login required)."""
    data = request.get_json()
    resume_json = data.get('resumeData')  # expects the resumeJSONdata object from MongoDB

    if not resume_json:
        return jsonify({"error": "resumeData is required"}), 400

    # Build a flat profile dict from the resume JSON structure
    profile = {}

    # Name / designation
    if resume_json.get('name'):
        profile['Name'] = resume_json['name']
    if resume_json.get('designation') or resume_json.get('title'):
        profile['Designation'] = resume_json.get('designation') or resume_json.get('title', '')

    # Skills – flatten all skill category items into one string
    skills_raw = resume_json.get('skills', [])
    if isinstance(skills_raw, list) and skills_raw:
        skill_items = []
        for cat in skills_raw:
            if isinstance(cat, dict) and cat.get('items'):
                skill_items.extend(cat['items'])
            elif isinstance(cat, str):
                skill_items.append(cat)
        if skill_items:
            profile['What are the skills do you have ?'] = ', '.join(skill_items)

    # Education
    education_raw = resume_json.get('education', [])
    if isinstance(education_raw, list) and education_raw:
        edu_parts = []
        for edu in education_raw:
            if isinstance(edu, dict):
                degree = edu.get('degree', '')
                field  = edu.get('field_of_study', '')
                inst   = edu.get('institution', '')
                year   = edu.get('graduation_year', '')
                edu_parts.append(' '.join(filter(None, [degree, field, 'at', inst, year])))
        if edu_parts:
            profile['Program'] = '; '.join(edu_parts)

    # Experience
    experience_raw = resume_json.get('experience', [])
    if isinstance(experience_raw, list) and experience_raw:
        exp_parts = []
        for exp in experience_raw:
            if isinstance(exp, dict):
                role = exp.get('role', '')
                org  = exp.get('organization', '')
                dur  = exp.get('duration', '')
                exp_parts.append(' '.join(filter(None, [role, 'at', org, dur])))
        if exp_parts:
            profile['Work Experience'] = '; '.join(exp_parts)

    # Projects
    projects_raw = resume_json.get('projects', [])
    if isinstance(projects_raw, list) and projects_raw:
        proj_parts = []
        for proj in projects_raw:
            if isinstance(proj, dict):
                name = proj.get('name', '')
                desc = proj.get('description', '')
                skills_used = ', '.join(proj.get('skills_used', []))
                proj_parts.append(' '.join(filter(None, [name, '-', desc, '| Skills:', skills_used])))
        if proj_parts:
            profile['Projects'] = '; '.join(proj_parts[:3])  # top 3 projects

    # Interests from resume
    interests_raw = resume_json.get('interests', []) or resume_json.get('interest', [])
    if isinstance(interests_raw, list) and interests_raw:
        interest_names = [i.get('name', i) if isinstance(i, dict) else str(i) for i in interests_raw]
        profile['What is you interested area?'] = ', '.join(filter(None, interest_names))

    # Summary / objective
    summary = resume_json.get('summary', '') or resume_json.get('objective', '')
    if summary:
        profile['Summary'] = summary

    if not profile:
        return jsonify({"error": "Could not extract any usable data from resumeData"}), 400

    print(f"\n[INFO] recommend-by-resume: built profile with {len(profile)} fields: {list(profile.keys())}")

    recommendations = generate_career_recommendations(profile)

    if isinstance(recommendations, dict) and "error" in recommendations:
        return jsonify({"error": recommendations["error"]}), 500

    return jsonify({"success": True, "recommendations": recommendations})


@app.route('/api/guidance-by-resume', methods=['POST'])
def guidance_by_resume():
    """Get personalized guidance from resume JSON data + user interest (no login required)."""
    data = request.get_json()
    resume_json = data.get('resumeData')
    interest    = data.get('interest', '').strip()

    if not resume_json:
        return jsonify({"error": "resumeData is required"}), 400
    if not interest:
        return jsonify({"error": "interest is required"}), 400

    # Reuse same profile-building logic
    profile = {}
    skills_raw = resume_json.get('skills', [])
    if isinstance(skills_raw, list):
        skill_items = []
        for cat in skills_raw:
            if isinstance(cat, dict) and cat.get('items'):
                skill_items.extend(cat['items'])
            elif isinstance(cat, str):
                skill_items.append(cat)
        if skill_items:
            profile['What are the skills do you have ?'] = ', '.join(skill_items)

    education_raw = resume_json.get('education', [])
    if isinstance(education_raw, list) and education_raw:
        edu_parts = []
        for edu in education_raw:
            if isinstance(edu, dict):
                degree = edu.get('degree', '')
                field  = edu.get('field_of_study', '')
                inst   = edu.get('institution', '')
                year   = edu.get('graduation_year', '')
                edu_parts.append(' '.join(filter(None, [degree, field, 'at', inst, year])))
        profile['Program'] = '; '.join(edu_parts)

    experience_raw = resume_json.get('experience', [])
    if isinstance(experience_raw, list) and experience_raw:
        exp_parts = []
        for exp in experience_raw:
            if isinstance(exp, dict):
                role = exp.get('role', '')
                org  = exp.get('organization', '')
                exp_parts.append(' '.join(filter(None, [role, 'at', org])))
        profile['Work Experience'] = '; '.join(exp_parts)

    summary = resume_json.get('summary', '') or resume_json.get('objective', '')
    if summary:
        profile['Summary'] = summary

    profile['What is you interested area?'] = interest

    guidance = generate_personalized_guidance(profile, interest)

    if isinstance(guidance, dict) and "error" in guidance:
        return jsonify({"error": guidance["error"]}), 500

    return jsonify({"success": True, "guidance": guidance})


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    ollama_ok = check_ollama()
    return jsonify({
        "status": "healthy",
        "database_loaded": df_students is not None,
        "ai_available": ollama_ok,
        "ai_model": OLLAMA_MODEL,
        "ollama_url": OLLAMA_BASE_URL,
        "total_students": len(df_students) if df_students is not None else 0
    })


if __name__ == "__main__":
    print("\n[INFO] Starting AI Career Recommendation Server...")
    print(f"[INFO] Total students loaded: {len(df_students) if df_students is not None else 0}")
    print("[INFO] Server running on http://localhost:5000\n")
    app.run(debug=True, port=5000)