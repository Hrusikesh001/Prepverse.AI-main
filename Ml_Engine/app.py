from flask import Flask, request, jsonify
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer, CrossEncoder
from bson import ObjectId
import numpy as np
import torch
import os
import re

from recommend_service import (
    build_or_regex_for_values,
    parse_stipend_to_number,
    parse_filter_stipend_range,
    last_date_is_open
)


from dotenv import load_dotenv

from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

app = Flask(__name__)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

BI_ENCODER_MODEL = "BAAI/bge-large-en-v1.5"
CROSS_ENCODER_MODEL = "cross-encoder/ms-marco-electra-base"

bi_encoder = None
cross_encoder = None
collection = None

def get_device():
    # Force cpu if needed, or check for cuda
    if torch.cuda.is_available():
        return "cuda"
    return "cpu"

def ensure_bi_encoder():
    global bi_encoder
    if bi_encoder is not None:
        return True, None
    try:
        print(f"Loading bi-encoder model: {BI_ENCODER_MODEL}...")
        bi_encoder = SentenceTransformer(
            BI_ENCODER_MODEL,
            device=get_device(),
            trust_remote_code=True
        )
        print(f"Bi-encoder loaded on {bi_encoder.device}.")
        return True, None
    except Exception as e:
        error_msg = str(e)
        print(f"FAILED to load bi-encoder: {error_msg}")
        return False, error_msg

def ensure_cross_encoder():
    global cross_encoder
    if cross_encoder is not None:
        return True, None
    try:
        print(f"Loading cross-encoder model: {CROSS_ENCODER_MODEL}...")
        cross_encoder = CrossEncoder(
            CROSS_ENCODER_MODEL,
            device=get_device()
        )
        print(f"Cross-encoder loaded on {get_device()}.")
        return True, None
    except Exception as e:
        error_msg = str(e)
        print(f"FAILED to load cross-encoder: {error_msg}")
        return False, error_msg

def ensure_mongo():
    global collection
    if collection is not None:
        return True, None
    
    uri = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
    db_name = os.getenv("DB_NAME") or "test"
    coll_name = os.getenv("COLLECTION_NAME") or "new_internships_data"

    if not uri:
        return False, "MONGO_URI or MONGODB_URI not found in environment."

    try:
        print(f"Connecting to MongoDB: {db_name}.{coll_name}...")
        print("[DEBUG] .env path:", env_path)
        print("[DEBUG] Database:", db_name)
        print("[DEBUG] Collection:", coll_name)
        client = MongoClient(uri)
        db = client[db_name]
        collection = db[coll_name]
        client.admin.command("ping")
        print("MongoDB connection successful.")
        return True, None
    except Exception as e:
        error_msg = str(e)
        print(f"FAILED to connect to MongoDB: {error_msg}")
        return False, error_msg

def startup():
    # Initial attempt to load everything
    ensure_bi_encoder()
    ensure_cross_encoder()
    ensure_mongo()

def clean_text(text: str) -> str:
    """Cleans and normalizes text for better embeddings."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9.,;:!?()\- ]", "", text)
    return text.strip()


def extract_candidate_skills(resume_json_data) -> list:
    """Extract all skill keywords from the structured resumeJSONdata."""
    skills = []
    if not resume_json_data or not isinstance(resume_json_data, dict):
        return skills

    # Skills section: [{name: "category", items: ["skill1", ...]}, ...]
    for skill_group in resume_json_data.get("skills", []):
        if isinstance(skill_group, dict):
            items = skill_group.get("items", [])
            if isinstance(items, list):
                skills.extend([str(i).lower().strip() for i in items if i])
            # Also capture category names (e.g., "Machine Learning", "Web Development")
            name = skill_group.get("name", "")
            if name:
                skills.append(name.lower().strip())

    # skills_used from experience and projects
    for section in ["experience", "projects", "contributions"]:
        for entry in resume_json_data.get(section, []):
            if isinstance(entry, dict):
                for s in entry.get("skills_used", []):
                    if s:
                        skills.append(str(s).lower().strip())

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for s in skills:
        if s not in seen:
            seen.add(s)
            unique.append(s)
    return unique


def build_internship_text(internship: dict) -> str:
    """Build a single lowercased string from all internship fields for keyword matching."""
    return " ".join(filter(None, [
        internship.get("jobTitle", ""),
        internship.get("jobRole", ""),
        internship.get("jobTopic", ""),
        internship.get("description", ""),
        internship.get("skills", "") if isinstance(internship.get("skills"), str)
        else " ".join(internship.get("skills", []) or []),
    ])).lower()


def compute_skill_overlap_score(candidate_skills: list, internship: dict) -> float:
    """Return a 0.0–1.0 skill overlap score between candidate and internship."""
    if not candidate_skills:
        return 0.5  # neutral if no skill data

    internship_text = build_internship_text(internship)
    if not internship_text.strip():
        return 0.5

    matched = sum(1 for skill in candidate_skills if skill in internship_text)
    overlap = min(matched / max(len(candidate_skills), 1), 1.0)
    return overlap


def hard_skill_filter(candidates: list, candidate_skills: list) -> list:
    """
    Hard filter: keep only internships where AT LEAST ONE candidate skill
    appears somewhere in the internship text (title / role / topic / description / skills).
    Falls back to the original list if everything would be eliminated.
    """
    if not candidate_skills:
        return candidates

    matched = []
    for c in candidates:
        text = build_internship_text(c)
        if any(skill in text for skill in candidate_skills):
            matched.append(c)

    if matched:
        print(f"[skill-filter] {len(matched)}/{len(candidates)} internships passed hard skill filter")
        return matched
    else:
        # Fallback: nothing matched — return originals so the user still sees something
        print("[skill-filter] WARNING: No internships matched any candidate skill. Returning unfiltered results.")
        return candidates




@app.route("/recommend", methods=["POST"])
def recommend():
    bi_ok, bi_err = ensure_bi_encoder()
    ce_ok, ce_err = ensure_cross_encoder()
    mongo_ok, mongo_err = ensure_mongo()

    if not (bi_ok and ce_ok and mongo_ok):
        errors = [e for e in [bi_err, ce_err, mongo_err] if e]
        return jsonify({"error": f"Server not ready: {', '.join(errors)}"}), 503

    data = request.get_json()
    user_vector = data.get("embedding")
    filters = data.get("filters", {})
    resume_json_data = data.get("resumeJSONdata", {})
    candidate_skills = extract_candidate_skills(resume_json_data)
    print("Filters received:", filters)
    print(f"Candidate skills extracted: {candidate_skills[:15]}" + (" ..." if len(candidate_skills) > 15 else ""))

    if not user_vector or not isinstance(user_vector, list):
        return jsonify({"error": "Invalid input. Provide 'embedding' as a list of floats."}), 400

    match_conditions = {}
    if "duration" in filters and filters["duration"]:
        match_conditions["duration"] = {"$in": filters["duration"]}

    type_filters = build_or_regex_for_values(filters.get("type", []))
    jobtype_filters = build_or_regex_for_values(filters.get("jobType", []))

    if type_filters and jobtype_filters:
        or_conditions = [{"type": r} for r in type_filters] + [{"jobType": r} for r in jobtype_filters]
        match_conditions["$or"] = or_conditions
    elif type_filters:
        match_conditions["type"] = type_filters[0] if len(type_filters) == 1 else {"$in": type_filters}
    elif jobtype_filters:
        match_conditions["jobType"] = jobtype_filters[0] if len(jobtype_filters) == 1 else {"$in": jobtype_filters}

   
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": user_vector,
                "numCandidates": 500,
                "limit": 100
            }
        }
    ]

    if match_conditions:
        pipeline.append({"$match": match_conditions})

    pipeline.append({
        "$project": {
            "_id": 1,
            "jobTitle": 1, "company": 1, "description": 1,
            "jobRole": 1, "jobTopic": 1, "duration": 1, "type": 1,
            "stipend": 1, "jobType": 1, "lastDate": 1, "skills": 1,
            "numOfQns": 1, "locationName": 1, "location": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    })

    try:
        print("[DEBUG] Database:", DB_NAME)
        print("[DEBUG] Collection:", collection.name)
        print("[DEBUG] Internship documents:", collection.count_documents({}))
        print("[DEBUG] Candidate embedding dimensions:", len(user_vector))
        print("[DEBUG] Candidate skills:", candidate_skills)
        print("[DEBUG] Filters:", filters)

        candidates = list(collection.aggregate(pipeline))

        print("[DEBUG] Vector search results:", len(candidates))

    except Exception as e:
        print("[ERROR] Vector search failed:", repr(e))
        return jsonify({
            "error": "Internship vector search failed",
            "details": str(e)
        }), 500

    if not candidates:
        print("[DEBUG] No internships returned by vector search.")
        return jsonify([])

    candidates = hard_skill_filter(candidates, candidate_skills)

    if not candidates:
        return jsonify([])

    # ── Hard skill filter ─────────────────────────────────────────────────────
    # Eliminate internships with zero skill overlap BEFORE any other processing.
    # This is the primary defence against model-mismatch causing wrong domains.
    candidates = hard_skill_filter(candidates, candidate_skills)

   
    location_filters = filters.get("location", [])
    if location_filters:
        print("Applying location filter in Python...")
        filtered_by_location = []

        loc_docs = list(collection.find(
            {"locationName": {"$in": location_filters}},
            {"locationName": 1, "location": 1}
        ))

        target_coords = [doc["location"]["coordinates"] for doc in loc_docs if "location" in doc]

        def haversine(coord1, coord2):
            import math
            R = 6371
            lon1, lat1 = coord1
            lon2, lat2 = coord2
            phi1, phi2 = math.radians(lat1), math.radians(lat2)
            dphi = math.radians(lat2 - lat1)
            dlambda = math.radians(lon2 - lon1)
            a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
            return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        for cand in candidates:
            cand_coords = cand.get("location", {}).get("coordinates")
            if not cand_coords:
                continue

            if cand.get("locationName") in location_filters:
                filtered_by_location.append(cand)
                continue

            for tc in target_coords:
                if haversine(tc, cand_coords) <= 100:
                    filtered_by_location.append(cand)
                    break

        candidates = filtered_by_location if filtered_by_location else candidates

   
    filtered_after_meta = []
    stipend_filters = []
    if "stipend" in filters and isinstance(filters["stipend"], list):
        for s in filters["stipend"]:
            r = parse_filter_stipend_range(str(s))
            if r:
                stipend_filters.append(r)

    available_open = False
    if "available" in filters and isinstance(filters["available"], list):
        if "open" in [x.lower() for x in filters["available"]]:
            available_open = True

    for cand in candidates:
        ok = True
        if stipend_filters:
            cand_stipend_val = parse_stipend_to_number(cand.get("stipend"))
            if cand_stipend_val is None:
                ok = False
            else:
                ok = any(mn <= cand_stipend_val <= mx for (mn, mx) in stipend_filters)
        if ok and available_open:
            if not last_date_is_open(cand.get("lastDate")):
                ok = False
        if ok:
            filtered_after_meta.append(cand)

    if not filtered_after_meta:
        return jsonify([])


    try:
        print("Re-ranking internships with Hybrid Score (Vector + Cross-Encoder + Skills)...")

        # Build a skill-enriched query string for the cross-encoder
        base_summary = data.get("resumeSummary", "")
        if candidate_skills:
            skills_prefix = "SKILLS: " + ", ".join(candidate_skills[:30]) + ". "
            ce_query = skills_prefix + base_summary
        else:
            ce_query = base_summary

        pairs = [
            (
                ce_query,
                f"Required skills: {c.get('skills', '')}. {c.get('jobTitle', '')}. {c.get('jobRole', '')}. {c.get('jobTopic', '')}. {c.get('description', '')}"
            )
            for c in filtered_after_meta
        ]

        cross_scores = np.array(cross_encoder.predict(pairs)).flatten()
        vector_scores = np.array([c.get("score", 0) for c in filtered_after_meta])

        # Compute skill overlap scores for each candidate
        skill_overlap_scores = np.array([
            compute_skill_overlap_score(candidate_skills, c)
            for c in filtered_after_meta
        ])

        # Hybrid score: vector + cross-encoder + skill overlap
        alpha = 0.45   # vector weight
        beta  = 0.30   # cross-encoder weight
        gamma = 0.25   # skill overlap weight
        hybrid_scores = (
            alpha * vector_scores +
            beta  * cross_scores +
            gamma * skill_overlap_scores
        )

        # Hard exclude zero-overlap results from final output (if candidate has skills).
        # Zero-overlap entries already removed by hard_skill_filter above, but
        # keep this as a safety net after re-ranking.
        if candidate_skills:
            min_overlap = 0.0  # hard_skill_filter guarantees >= 1 match; keep all
        else:
            min_overlap = -1.0  # no skills info — allow everything through

        percentile_threshold = np.percentile(hybrid_scores, 40)
        filtered_after_meta = [
            dict(c, rerank_score=float(hs), skill_overlap=float(so))
            for c, hs, so in zip(filtered_after_meta, hybrid_scores, skill_overlap_scores)
            if hs >= percentile_threshold and so > min_overlap
        ]

        if not filtered_after_meta:
            return jsonify([])

        filtered_after_meta.sort(key=lambda x: x["rerank_score"], reverse=True)
        top_results = filtered_after_meta[:10]

        for item in top_results:
            item["_id"] = str(item["_id"])
            item.pop("location", None)

        print(f"Top match skill overlaps: {[round(r.get('skill_overlap',0),2) for r in top_results]}")
        return jsonify(top_results)

    except Exception as e:
        return jsonify({"error": f"Hybrid re-ranking failed: {e}"}), 500










@app.route("/embed", methods=["POST"])
def embed_job():
    ok, err = ensure_bi_encoder()
    if not ok:
        return jsonify({"error": f"Bi-encoder model not loaded: {err}"}), 503

    data = request.get_json()

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid input. Expected a JSON object with job details."}), 400

    try:
        combined_text = build_combined_text(data)
        if not combined_text:
            return jsonify({"error": "No valid text to generate embedding."}), 400

        print("Generating embedding for job data...")
        embedding = bi_encoder.encode(
            combined_text,
            normalize_embeddings=True
        ).tolist()

        result = data.copy()
        result["embedding"] = embedding

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Failed to generate embedding: {e}"}), 500


@app.route("/embed_candidate", methods=["POST"])
def embed_candidate():
    ok, err = ensure_bi_encoder()
    if not ok:
        return jsonify({"error": f"Bi-encoder model not loaded: {err}"}), 503

    data = request.get_json()
    summary = data.get("summary")
    resume_json_data = data.get("resumeJSONdata", {})

    if not summary or not isinstance(summary, str):
        return jsonify({"error": "Invalid input"}), 400

    try:
        # Build a skill-enriched text so the embedding captures explicit skills,
        # not just the vague prose summary from the LLM.
        skills = extract_candidate_skills(resume_json_data)
        if skills:
            # Repeat skills 3x to give them strong weight in the embedding space
            skills_block = "Skills: " + ", ".join(skills) + ". "
            enriched_text = (skills_block * 3) + summary
        else:
            enriched_text = summary

        print(f"Generating candidate embedding. Skills found: {len(skills)}")
        embedding = bi_encoder.encode(
            enriched_text,
            normalize_embeddings=True
        ).tolist()

        result = {
            "summary": summary,
            "embedding": embedding
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Failed to generate embedding: {e}"}), 500
    
    
    
@app.route("/eligible_users", methods=["POST"])
def eligible_users():
    bi_ok, bi_err = ensure_bi_encoder()
    ce_ok, ce_err = ensure_cross_encoder()
    if not (bi_ok and ce_ok):
        return jsonify({"error": f"Models missing: {bi_err or ''} {ce_err or ''}"}), 503

    data = request.get_json()
    internship_id = data.get("internshipId")

    if not internship_id:
        return jsonify({"error": "Invalid input. Provide 'internshipId'"}), 400

    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]

        internship_collection = db["new_internships_data"]
        resume_collection = db["resumedatas"]

        internship = internship_collection.find_one(
            {"_id": ObjectId(internship_id)},
            {"embedding": 1, "description": 1, "jobTitle": 1, "jobRole": 1, "jobTopic": 1}
        )

        if not internship or "embedding" not in internship:
            return jsonify({"error": "Internship not found or missing embedding"}), 404

        internship_embedding = internship["embedding"]
        internship_desc = internship.get("description", "Internship posting")

        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index2",
                    "path": "embedding",
                    "queryVector": internship_embedding,
                    "numCandidates": 2000,
                    "limit": 200
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "userId": 1,
                    "embedding": 1,
                    "resumeJSONdata": 1,
                    "resumeReview": 1,
                    "vectorScore": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        resumes = list(resume_collection.aggregate(pipeline))
        if not resumes:
            return jsonify({"eligible_users": [], "all_ranked_results": []})

        keywords = f"{internship.get('jobTitle','')} {internship.get('jobRole','')} {internship.get('jobTopic','')} {internship.get('description','')}".lower().split()
        filtered_resumes = []
        for r in resumes:
            resume_text = str(r.get("resumeJSONdata", "")).lower()
            if any(k in resume_text for k in keywords):
                filtered_resumes.append(r)

        if not filtered_resumes:
            return jsonify({"eligible_users": [], "all_ranked_results": []})

        resumes = filtered_resumes


        pairs = [(internship_desc, str(r.get("resumeJSONdata", ""))) for r in resumes]
        raw_cross_scores = cross_encoder.predict(pairs)
        cross_scores = np.array(raw_cross_scores).flatten()
        if cross_scores.max() != cross_scores.min():
            cross_scores = (cross_scores - cross_scores.min()) / (cross_scores.max() - cross_scores.min())
        else:
            cross_scores = np.ones_like(cross_scores) * 0.5

        vector_scores = np.array([r["vectorScore"] for r in resumes])
        hybrid_scores = 0.6 * vector_scores + 0.4 * cross_scores

        percentile_threshold = np.percentile(hybrid_scores, 50)

        min_vector_score = 0.5   
        min_cross_score = 0.3

        eligible_users = []
        ranked_results = []

        for r, ce_score, hybrid_score in zip(resumes, cross_scores, hybrid_scores):
            user_id = str(r["userId"])
            vector_score = r["vectorScore"]
            final_score = hybrid_score

            ranked_results.append({
                "userId": user_id,
                "vector_score": float(vector_score),
                "cross_score": float(ce_score),
                "final_score": float(final_score),
                "resumeReview": r.get("resumeReview")
            })

            if final_score >= percentile_threshold and vector_score >= min_vector_score and ce_score >= min_cross_score:
                eligible_users.append({
                    "userId": user_id,
                    "vector_score": float(vector_score),
                    "cross_score": float(ce_score),
                    "final_score": float(final_score),
                    "resumeReview": r.get("resumeReview")
                })

        eligible_users = sorted(eligible_users, key=lambda x: x["final_score"], reverse=True)

        return jsonify({
            "eligible_users": eligible_users,
            "all_ranked_results": ranked_results
        })

    except Exception as e:
        return jsonify({"error": f"Failed to compute eligibility: {e}"}), 500



if __name__ == "__main__":
    startup() 
    print("Starting Flask server for recommendation engine...")
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
    
    
    