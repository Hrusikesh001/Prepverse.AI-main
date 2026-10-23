import requests
import json

def test_summarize():
    url = "http://localhost:3000/summarize"
    data = {
        "resume_data": {
            "skills": [{"name": "Technical", "items": ["Python", "React"]}],
            "experience": [{"organization": "Test Corp", "role": "Intern", "duration": "3 months", "responsibilities": ["Coding"]}]
        }
    }
    try:
        print("Testing /summarize endpoint...")
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_summarize()
