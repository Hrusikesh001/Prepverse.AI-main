import requests
import json

def test_recommendations():
    url = "http://localhost:5000/api/recommendations"
    payload = {
        "registrationNumber": "2301109126" # Use the one from the user's logs
    }
    
    try:
        print("Testing /api/recommendations...")
        response = requests.post(url, json=payload, timeout=310)
        print(f"Status Code: {response.status_code}")
        print("Response Content:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_recommendations()
