import requests
import json
import time

def test_pipeline():
    print("1. Testing /parse-resume")
    # create dummy pdf
    with open("dummy.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Python Developer Javascript) Tj\nET\nendstream\nendobj\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\n%%EOF")
    
    t0 = time.time()
    try:
        with open("dummy.pdf", "rb") as f:
            res1 = requests.post("http://127.0.0.1:3000/parse-resume", files={"file": f})
        print(f"Status: {res1.status_code}, Time: {time.time()-t0:.2f}s")
        print(f"Response: {res1.text[:200]}")
        res1.raise_for_status()
        resume_data_str = res1.json().get("resume_data")
        resume_data = json.loads(resume_data_str)
    except Exception as e:
        print(f"Failed at parse-resume: {e}")
        return

    print("\n2. Testing /summarize")
    t0 = time.time()
    try:
        res2 = requests.post("http://127.0.0.1:3000/summarize", json={"resume_data": resume_data})
        print(f"Status: {res2.status_code}, Time: {time.time()-t0:.2f}s")
        print(f"Response: {res2.text[:200]}")
        res2.raise_for_status()
        summary = res2.json().get("summary")
    except Exception as e:
        print(f"Failed at summarize: {e}")
        return
        
    print("\n3. Testing /embed_candidate")
    t0 = time.time()
    try:
        res3 = requests.post("http://127.0.0.1:5001/embed_candidate", json={"summary": summary, "resumeJSONdata": resume_data})
        print(f"Status: {res3.status_code}, Time: {time.time()-t0:.2f}s")
        print(f"Response: {res3.text[:200]}")
        res3.raise_for_status()
    except Exception as e:
        print(f"Failed at embed_candidate: {e}")
        return

    print("\nSUCCESS!")

if __name__ == "__main__":
    test_pipeline()
