import os
import re
import random
import pandas as pd
from tqdm import tqdm
from dotenv import load_dotenv
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

MODEL_NAME = "Alibaba-NLP/gte-large-en-v1.5"
CSV_FILE_PATH = "Internship_dataset.csv"  

random.seed(42)

def clean_text(text: str) -> str:
    """Cleans and normalizes text for better embeddings."""
    if not isinstance(text, str):
        return ""
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-z0-9.,;:!?()\- ]", "", text)
    return text

def build_combined_text(row: pd.Series) -> str:
    """Builds a semantically rich internship representation with weighted fields."""
    parts = []
    if row.get("Job Title"):
        parts.append(f"Internship Title: {clean_text(row['Job Title'])}. ")
    if row.get("Job Role"):
        parts.append((f"Role: {clean_text(row['Job Role'])}. ") * 2)
    if row.get("Job Topics"):
        parts.append((f"Topic: {clean_text(row['Job Topics'])}. ") * 4)
    if row.get("Job Description"):
        parts.append((f"Responsibilities include: {clean_text(row['Job Description'])}. ") * 2)
    return " ".join(parts).strip()

def connect_mongo():
    """Connect to MongoDB Atlas with validation."""
    if not MONGO_URI:
        raise RuntimeError("MONGO_URI not found in environment variables")

    try:
        client = MongoClient(MONGO_URI)
        client.admin.command("ping")
        print("MongoDB connection successful.")
        return client
    except Exception as e:
        raise RuntimeError(f"MongoDB connection failed: {e}")

def load_model():
    """Load SentenceTransformer model."""
    print(f"Loading model: {MODEL_NAME} ...")
    try:
        model = SentenceTransformer(MODEL_NAME, trust_remote_code=True)
        print("Model loaded successfully.")
        return model
    except Exception as e:
        raise RuntimeError(f"Error loading model: {e}")

def process_csv():
    """Load and preprocess internship dataset."""
    if not os.path.exists(CSV_FILE_PATH):
        raise FileNotFoundError(f"File not found: {CSV_FILE_PATH}")
    print(f"Loading dataset: {CSV_FILE_PATH} ...")
    df = pd.read_csv(CSV_FILE_PATH)
    print(f"Loaded {len(df)} internships from CSV.")
    return df

def parse_coordinates(coord_str: str):
    """Parses 'lat,lon' string and returns GeoJSON Point [lon, lat]."""
    if not isinstance(coord_str, str) or "," not in coord_str:
        return None
    try:
        lat, lon = map(float, coord_str.split(","))
        return {
            "type": "Point",
            "coordinates": [lon, lat]  
        }
    except Exception:
        return None

def main():
    client = connect_mongo()
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    model = load_model()
    df = process_csv()

    print(f"Clearing existing data in collection '{COLLECTION_NAME}' ...")
    collection.delete_many({})

    internship_texts, internship_metadata = [], []

    print("Preparing internship texts ...")
    for _, row in tqdm(df.iterrows(), total=len(df)):
        combined_text = build_combined_text(row)
        if not combined_text:
            continue

        coord_geojson = parse_coordinates(row.get("Coordinates"))

        internship_texts.append(combined_text)
        internship_metadata.append({
            "jobTitle": row.get("Job Title"),
            "jobTopic": row.get("Job Topics"),
            "duration": row.get("Duration"),
            "type": row.get("Type"),
            "company": row.get("Company"),
            "stipend": row.get("Stipend"),
            "jobType": row.get("Job Type"),
            "lastDate": row.get("Last Date"),
            "description": row.get("Job Description"),
            "jobRole": row.get("Job Role"),
            "numOfQns": random.randint(2, 5),
            "locationName": row.get("Location"),
            "location": coord_geojson
        })

    print("Generating embeddings in batches ...")
    embeddings = model.encode(
        internship_texts,
        batch_size=32,
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=True
    )

    print(f"Inserting {len(internship_metadata)} documents into MongoDB ...")
    for meta, emb in zip(internship_metadata, embeddings):
        meta["embedding"] = emb.tolist()

    try:
        collection.insert_many(internship_metadata, ordered=False)
        print(f"Data insertion complete! Total docs: {collection.count_documents({})}")
    except Exception as e:
        print(f"Error during insertion: {e}")

    collection.create_index([("location", "2dsphere")])
    print("2dsphere index created on 'location'.")

    client.close()
    print("MongoDB connection closed.")

if __name__ == "__main__":
    main()
