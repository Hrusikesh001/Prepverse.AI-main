from flask import Flask, request, send_file, jsonify, after_this_request, redirect, url_for, session, Response
import fitz
import tempfile
import os
import requests
from llmFunctions import evaluate_resume
from llmFunctions import parse_resume_with_llm
from llmFunctions import generate_user_summary
import asyncio
import edge_tts
from flask_cors import CORS
import uuid


app = Flask(__name__)
CORS(app)

@app.route("/parse-resume", methods=['post'])
def parse_resume():

  print("Received request at /parse-resume")
  if 'file' not in request.files:
    return jsonify({"message" : "No file Found"}), 400
  
  uploaded_file = request.files['file']
  
  with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
    uploaded_file.save(temp.name)
    temp_path = temp.name
  
  try:
    print(f"Reading PDF from {temp_path}")
    doc = fitz.open(temp_path)
    resume_text = "\n".join([page.get_text() for page in doc])
    doc.close()
    os.remove(temp_path)
    
    print(f"Extracted {len(resume_text)} characters. Sending to LLM...")
    parsed_resume_data = parse_resume_with_llm(resume_text)
    print("Received parsed resume data from LLM.")
    
    return jsonify({"resume_data" : parsed_resume_data})
  except Exception as e:
    print(f"Exception in parse_resume: {e}")
    return jsonify({"message" : str(e)}), 500
  
  
@app.route("/evaluate-resume", methods=["POST"])
def evaluate_resume_endpoint():
    data = request.json
    resume_json = data.get("resume_data")
    job_title = data.get("job_title")
    topics = data.get("topics") 

    result = evaluate_resume(resume_json, job_title, topics)
    return jsonify({"evaluation": result})



@app.route("/speak", methods=["POST"])
def speak():
  try:
    data = request.json
    user_text = data.get("text", "Hello, how can I help you?")
    voice = "en-US-JennyNeural"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
      file_path = temp_audio.name

    async def generate_audio():
      tts = edge_tts.Communicate(text=user_text, voice=voice)
      await tts.save(file_path)

    asyncio.run(generate_audio())

    @after_this_request
    def cleanup(response):
      try:
        os.remove(file_path)
        print(f"Deleted: {file_path}")
      except Exception as e:
        print("Cleanup error:", e)
      return response

    return send_file(file_path, mimetype="audio/mpeg")

  except Exception as e:
    return jsonify({"error": str(e)}), 500
  
  
@app.route("/summarize", methods=["POST"])
def summarize_profile():
  """
  API endpoint to receive user JSON and return a generated summary.
  """
  print("Received request on /summarize endpoint.")
  
  data = request.get_json()
  if not data or "resume_data" not in data:
    return jsonify({"error": "Invalid input: resume_data missing."}), 400

  resume_data = data["resume_data"]

  try:
    summary = generate_user_summary(resume_data)
    if not summary:
      summary = "Candidate with various skills and experience."
    print(f"Successfully generated summary ({len(summary)} chars).")
    return jsonify({"summary": summary})

  except Exception as e:
    print(f"Unexpected error in summarize_profile: {e}")
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=3000, debug=False)
