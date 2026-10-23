
# Prepverse.AI

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![NPM Version](https://img.shields.io/badge/npm-v8.0.0-orange)

**Prepverse.AI** is an AI and machine learning-powered platform that helps candidates find the most relevant internships under the PM Internship Scheme. It provides recommendations, real-time alerts, and preparation tools like AI-powered mock interviews and resume optimization. The platform is mobile-friendly and supports multiple regional languages.

---

## Table of Contents

- [Pulling the Repository](#pulling-the-repository)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Repository](#repository)

---

## Pulling the Repository

First, clone the repository from GitHub:

```bash
git clone https://github.com/PrepverseOrganization/Prepverse.AI.git
```

Then move into the project folder:

```bash
cd Prepverse.AI
```

---

## Features

- Recommends top internships based on candidate skills, education, and preferences.  
- Sends alerts via WhatsApp and Email for new internships.  
- Provides preparation tools: mock interviews, quizzes, and resume optimization.  
- Mobile-friendly and multilingual for easy access by low-digital-literacy users.

---

## Prerequisites

- Node.js >= 18  
- Python >= 3.11  
- MongoDB  
- npm or yarn  
- llama3.1:8b
- Alibaba-NLP/gte-large-en-v1.5
- cross-encoder/ms-marco-electra-base

---

## Installation

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ML Engine
```bash
cd ml_engine
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Client Parser
```bash
cd clientParser
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

## Usage

After starting all components:

1. Open your browser and go to `http://localhost:3000` (frontend).  
2. Register or log in as a candidate.  
3. Fill in your education, skills, interests, and location preferences.  
4. View recommended internships and receive alerts via WhatsApp or Email.  

---

## Environment Variables

### Backend
```env
PORT=
MONGODB_URI=
JWT_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
SMTP_HOST=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=
WHATSAPP_TOKEN=
GEOAPIFY_KEY=
```

### ML Engine
```env
MONGO_URI=
DB_NAME=
COLLECTION_NAME=
```

---

## Contributing

We welcome contributions!  

1. Fork the repository.  
2. Create a new branch (`git checkout -b feature/your-feature`).  
3. Make your changes and commit (`git commit -m 'Add new feature'`).  
4. Push to the branch (`git push origin feature/your-feature`).  
5. Open a Pull Request.  

---


