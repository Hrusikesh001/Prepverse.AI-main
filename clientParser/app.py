
from flask import (
    Flask,
    request,
    send_file,
    jsonify,
    after_this_request,
)
import fitz
import tempfile
import os
import asyncio
import edge_tts
from flask_cors import CORS

from llmFunctions import (
    evaluate_resume,
    parse_resume_with_llm,
    generate_user_summary,
)

app = Flask(__name__)
CORS(app)

FLASK_HOST = "127.0.0.1"
FLASK_PORT = 3000


@app.route("/parse-resume", methods=["POST"])
def parse_resume():
    print("Received request at /parse-resume")

    if "file" not in request.files:
        return jsonify({"message": "No file found"}), 400

    uploaded_file = request.files["file"]

    if not uploaded_file.filename:
        return jsonify({"message": "No file selected"}), 400

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf",
        ) as temp:
            uploaded_file.save(temp.name)
            temp_path = temp.name

        print(f"Reading uploaded PDF")

        with fitz.open(temp_path) as doc:
            resume_text = "\n".join(
                page.get_text() for page in doc
            )

        if not resume_text.strip():
            return jsonify({
                "message": (
                    "No readable text found in the PDF. "
                    "The PDF may be scanned or image-based."
                )
            }), 422

        print(
            f"Extracted {len(resume_text)} characters. "
            "Sending to resume parser..."
        )

        parsed_resume_data = parse_resume_with_llm(resume_text)

        if not isinstance(parsed_resume_data, dict) or not parsed_resume_data:
            return jsonify({
                "message": "Resume parsing returned invalid or empty data."
            }), 422

        # Log field names only; avoid printing personal resume information.
        print(
            "Resume parsing successful. Fields:",
            list(parsed_resume_data.keys()),
        )

        return jsonify({
            "resume_data": parsed_resume_data
        }), 200

    except Exception:
        app.logger.exception("Error in parse_resume")

        return jsonify({
            "message": "Failed to parse the resume."
        }), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                app.logger.warning(
                    "Could not delete temporary resume file."
                )


@app.route("/evaluate-resume", methods=["POST"])
def evaluate_resume_endpoint():
    print("Received request at /evaluate-resume")

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Request body must be valid JSON."
        }), 400

    resume_json = data.get("resume_data")
    job_title = data.get("job_title")
    topics = data.get("topics")

    if not isinstance(resume_json, (dict, list)) or not resume_json:
        return jsonify({
            "message": "resume_data must be a non-empty JSON object or array."
        }), 400

    if not isinstance(job_title, str) or not job_title.strip():
        return jsonify({
            "message": "A valid job_title is required."
        }), 400

    if isinstance(topics, str):
        topics = [
            topic.strip()
            for topic in topics.split(",")
            if topic.strip()
        ]

    if (
        not isinstance(topics, list)
        or not topics
        or not all(
            isinstance(topic, str) and topic.strip()
            for topic in topics
        )
    ):
        return jsonify({
            "message": "Provide at least one valid topic."
        }), 400

    try:
        # Debug the actual input without logging personal resume details.
        print("\n========== EVALUATION DEBUG ==========")
        print("Job title:", job_title.strip())
        print("Topics:", topics)

        if isinstance(resume_json, dict):
            print("Resume top-level keys:", list(resume_json.keys()))
            for section, value in resume_json.items():
                if isinstance(value, list):
                    print(f"{section}: list with {len(value)} items")
                elif isinstance(value, dict):
                    print(f"{section}: object with keys {list(value.keys())}")
                else:
                    print(f"{section}: {type(value).__name__}")

        print("======================================\n")

        result = evaluate_resume(
            resume_json,
            job_title.strip(),
            topics,
        )

        if not isinstance(result, dict):
            raise ValueError(
                "evaluate_resume must return a dictionary."
            )

        total_score = result.get("total_score")
        summary_feedback = result.get("summary_feedback", "")

        if (
            not isinstance(total_score, (int, float))
            or isinstance(total_score, bool)
            or not 0 <= total_score <= 100
        ):
            raise ValueError(
                "Evaluation returned an invalid total_score."
            )

        if not isinstance(summary_feedback, str):
            summary_feedback = str(summary_feedback)

        print("Evaluation score:", total_score)
        print("Evaluation feedback:", summary_feedback)

        return jsonify({
            "evaluation": {
                "total_score": total_score,
                "summary_feedback": summary_feedback,
            }
        }), 200

    except Exception:
        app.logger.exception("Resume evaluation failed")

        return jsonify({
            "message": "Failed to evaluate the resume."
        }), 500


@app.route("/speak", methods=["POST"])
def speak():
    file_path = None

    try:
        data = request.get_json(silent=True) or {}
        user_text = data.get(
            "text",
            "Hello, how can I help you?",
        )

        if not isinstance(user_text, str) or not user_text.strip():
            return jsonify({
                "error": "Please provide text to speak."
            }), 400

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".mp3",
        ) as temp_audio:
            file_path = temp_audio.name

        async def generate_audio():
            tts = edge_tts.Communicate(
                text=user_text,
                voice="en-US-JennyNeural",
            )
            await tts.save(file_path)

        asyncio.run(generate_audio())

        @after_this_request
        def cleanup(response):
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    app.logger.warning(
                        "Could not delete temporary audio file."
                    )
            return response

        return send_file(
            file_path,
            mimetype="audio/mpeg",
        )

    except Exception:
        app.logger.exception("Text-to-speech failed")

        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass

        return jsonify({
            "error": "Failed to generate audio."
        }), 500


@app.route("/summarize", methods=["POST"])
def summarize_profile():
    print("Received request on /summarize endpoint.")

    data = request.get_json(silent=True)

    if not isinstance(data, dict) or "resume_data" not in data:
        return jsonify({
            "error": "Invalid input: resume_data missing."
        }), 400

    resume_data = data["resume_data"]

    try:
        summary = generate_user_summary(resume_data)

        if not summary:
            summary = "Candidate with various skills and experience."

        print(
            f"Successfully generated summary ({len(summary)} chars)."
        )

        return jsonify({
            "summary": summary
        }), 200

    except Exception:
        app.logger.exception("Profile summarization failed")

        return jsonify({
            "error": "Failed to summarize the profile."
        }), 500


if __name__ == "__main__":
    app.run(
        host=FLASK_HOST,
        port=FLASK_PORT,
        debug=False,
    )
