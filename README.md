---
# 💬 Asha AI Chatbot – Documentation

## 📘 Index

1. [Overview](#overview) 
2. [Features](#features)
3. [Datasets Used](#datasets-used-in-the-asha-ai-chatbot-project)
4. [Repository Structure](#repository-structure)
5. [How to Run](#how-to-run)
6. [API Integrations](#api-integrations)
7. [Frontend Overview](#frontend-overview)
8. [Backend Overview](#backend-overview)
9. [Data Preprocessing](#data-preprocessing)
10. [Acknowledgements](#acknowledgements)

---

## 🧠 Overview

Asha AI (ashabot) is an inclusive AI chatbot built to empower women by providing access to job opportunities, mentorship, and personalized career guidance. It uses real-time job APIs, resume parsing, and D&I (Diversity and Inclusion) datasets to offer helpful and relevant insights for users.
It has been deployed online at-
[!]https://asha-ai-bot-blue.vercel.app/

---

## ✨ Features

- Real-time job search from Google Jobs and Indeed APIs
- Resume parsing and job matching
- Diversity & Inclusion recommendations
- Chat with historical query memory
- Dashboard for profile and job views
- Responsive frontend using React

---

## 📊 Datasets Used in the Asha AI Chatbot Project

### **Overview**
The Asha AI Chatbot leverages multiple datasets to provide real-time job listings, mentorship opportunities, and personalized career recommendations. Data is sourced from publicly available platforms and APIs.

---

### **1. Google Jobs Search API**
- **Source**: [Google Jobs API](https://developers.google.com/jobs)
- **Description**: Fetches real-time job listings dynamically based on user queries, including job titles, companies, and locations.

---

### **2. Indeed API**
- **Source**: [Indeed API](https://www.indeed.com/publisher)
- **Description**: Pulls updated job postings from the Indeed database including roles, descriptions, and companies.

---

### **3. LinkedIn Job Listings (1.3M Dataset)**
- **Source**: [Kaggle](https://www.kaggle.com/datasets/1-3m-linkedin-jobs-skills)
- **Description**: Contains 1.3M job listings with skills, job titles, and company information for skill-job alignment.

---

### **4. PwC Diversity & Inclusion Dashboard**
- **Source**: [PwC D&I](https://www.pwc.com/gx/en/services/consulting/diversity-and-inclusion.html)
- **Description**: Promotes jobs at inclusive companies by referencing their D&I initiatives and metrics.

---

### **5. Resume Dataset (Livecareer)**
- **Source**: [Livecareer](https://www.livecareer.com/resumes)
- **Description**: Resume samples used for parsing and comparing with job descriptions for match accuracy.

---

### **6. Lightcast - Open Skills API**
- **Source**: [Lightcast](https://www.lighcast.com/)
- **Description**: Provides emerging and in-demand skill trends, used to enhance recommendations for users to upskill.

---

## 📁 Repository Structure

```bash
AshaAIBot/
│
├── README.md
├── allfileshas.txt
├── myenv/                  # Python virtual environment
├── data/                   # Datasets used for chatbot training and matching
│   ├── llmchatbot/
│   │   ├── jobs_chatbot.csv
│   │   ├── llm_pwc.csv
│   │   └── resume_chatbot.csv
│   └── resumejobmatch/
│       ├── jobmatch_jobs.csv
│       ├── jobmatch_linkedinpost.csv
│       ├── jobmatch_linkedinskills.csv
│       └── jobmatch_resumes.csv
│
├── datapreprocess_clean/   # Cleaned datasets and scripts
│
├── sample_models/          # Sample models (optional)
│
├── asha_ai/                # Main chatbot app
│   ├── backend/            # Node.js + Python backend
│   │   ├── server.js
│   │   ├── serverworking.js
│   │   ├── diversityinclusion.xlsx
│   │   ├── ai/
│   │   │   ├── matchjobs.js
│   │   │   ├── smartresponse.js
│   │   │   └── career_csvs/
│   │   └── routes/
│   │       ├── app.py
│   │       ├── jobsRoute.js
│   │       ├── requirements.txt
│
│   └── src/                # React frontend
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── Chatbot.js
│       │   ├── Chatwithhistory.js
│       │   ├── Home.js
│       │   ├── Dashboard.js
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── Profile.js
│       │   ├── matchjob.js
│       │   ├── DiversityViewer.js
│       │   └── NavigationBar.js
```

---

## 🛠️ How to Run

### 1. Backend (Node + Python)
```bash
cd asha_ai/backend
npm install
node server.js
```

> Optionally run Python APIs from `routes/app.py` using Flask or FastAPI:
```bash
cd routes
pip install -r requirements.txt
python3 app.py
```

---

### 2. Frontend (React)
```bash
cd asha_ai
npm install
npm start
```

---

## 🔌 API Integrations

- Google Jobs Search API
- Indeed Jobs API
- Lightcast Open Skills API
- Custom resume and job parsing functions in `ai/matchjobs.js` and `smartresponse.js`

---

## 💻 Frontend Overview

React components located in:
```
asha_ai/src/components/
```

Each component corresponds to pages or UI features like:
- `Chatbot.js` – AI assistant interface
- `Login.js`, `Signup.js`, `Profile.js` – Auth and profile pages
- `matchjob.js` – Resume to job matching logic
- `DiversityViewer.js` – D&I visualization

---

## ⚙️ Backend Overview

Node.js with Express for job APIs and integration with Python.
Key files:
- `server.js` – Main server logic
- `ai/smartresponse.js` – AI reply generation
- `routes/jobsRoute.js` – Routes for job search APIs

---

## 🧼 Data Preprocessing

Cleaned datasets and scripts stored in:
```
datapreprocess_clean/
```
Used for preparing CSVs for training, matching, and chatbot response enrichment.

---

## 🙌 Acknowledgements

- [Google Cloud](https://cloud.google.com/)
- [Indeed](https://www.indeed.com/)
- [LinkedIn Datasets on Kaggle](https://www.kaggle.com/)
- [PwC Diversity & Inclusion Initiative](https://www.pwc.com/gx/en/services/consulting/diversity-and-inclusion.html)
- [Lightcast Skills](https://www.lighcast.com/)
- [Livecareer Resume Samples](https://www.livecareer.com/resumes)

---
```

Let me know if you'd like me to help generate a PDF version of this or convert this into a `README.md` file directly.
