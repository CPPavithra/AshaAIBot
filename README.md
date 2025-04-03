
---

## **Datasets Used in the Asha AI Chatbot Project**

### **Overview**
The Asha AI Chatbot leverages multiple datasets to provide real-time job listings, mentorship opportunities, and personalized career recommendations. The data is sourced from publicly available job platforms, career databases, and diversity & inclusion reports, ensuring the chatbot provides relevant and accurate insights to users. Below are the datasets integrated into the system:

---

### **1. Google Jobs Search API**
- **Source**: [Google Jobs API](https://developers.google.com/jobs)
- **Description**: The Google Jobs API allows the chatbot to search for real-time job listings based on user-provided queries. The API returns a variety of job information, including job titles, descriptions, company names, and job locations. The data is dynamically fetched based on user queries, allowing for personalized job recommendations across various industries.

---

### **2. Indeed API**
- **Source**: [Indeed API](https://www.indeed.com/publisher)
- **Description**: The Indeed API provides access to real-time job listings across a wide range of industries and job titles. By integrating this API, the chatbot can pull relevant job postings and share them with users, along with additional details like job responsibilities, company information, and location.

---

### **3. LinkedIn Job Listings (1.3M LinkedIn Jobs & Skills Dataset)**
- **Source**: [Kaggle: 1.3M LinkedIn Jobs & Skills Dataset](https://www.kaggle.com/datasets/1-3m-linkedin-jobs-skills)
- **Description**: This dataset contains a collection of 1.3 million job listings from LinkedIn. It includes job titles, descriptions, skills required, and company details. This large dataset is used to supplement real-time job searches and provide a broader perspective on the job market.

---

### **4. PwC Diversity & Inclusion Dashboard**
- **Source**: [PwC Diversity & Inclusion Dashboard](https://www.pwc.com/gx/en/services/consulting/diversity-and-inclusion.html) (Kaggle)
- **Description**: This dataset includes insights and reports on diversity and inclusion efforts within various organizations. The data helps the chatbot promote gender equity and diversity by emphasizing companies that prioritize inclusivity, and it can be used to recommend jobs from companies that align with such values.

---

### **5. Resume Dataset (Livecareer)**
- **Source**: [Livecareer Resume Dataset](https://www.livecareer.com/resumes)
- **Description**: A collection of resumes from livecareer.com that provides examples of resumes in various fields. This dataset is used for resume parsing and job matching, helping the chatbot suggest job opportunities based on a user's resume or profile.

---

### **6. Lighcast-Open Skills API**
- **Source**: [Lighcast-Open Skills API](https://www.lighcast.com/)
- **Description**: The Lighcast Open Skills API provides detailed skillset data across various industries. It helps the chatbot recommend emerging skills based on the job search trends and provides suggestions on upskilling based on user preferences and job market trends.

---

### **Usage and Data Integration**
- The datasets are used to train and fine-tune the model for better job matching and personalized career guidance. By leveraging both structured (CSV) and unstructured (API) data, the chatbot offers dynamic, real-time responses to users.
- All external APIs are accessed during the chatbot's execution to provide the latest job listings, mentorship opportunities, and insights into the job market. This ensures that users receive the most up-to-date and relevant information.

---


asha-ai-chatbot/
│
├── backend/                  # Server-side logic (APIs, Model, Integrations)
│   ├── controllers/          # API controllers
│   ├── routes/               # Routes for various services (job listings, mentorship, etc.)
│   ├── models/               # Database models (user profiles, job data, events)
│   ├── services/             # Business logic (e.g., chatbot, job matching)
│   ├── utils/                # Utility functions (e.g., encryption, file handling)
│   ├── data/                 # Preprocessed datasets for model training
│   ├── config/               # Configuration files (API keys, environment settings)
│   ├── app.js                # Main Express app file
│   └── server.js             # Server start-up file
│
├── frontend/                 # Frontend for the chatbot UI
│   ├── public/               # Public assets (images, fonts, etc.)
│   ├── src/                  # Main React source code
│   │   ├── components/       # React components (UI elements, forms, buttons)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Pages for different routes (home, job search, mentorship)
│   │   ├── utils/            # Helper functions (API calls, session management)
│   │   ├── App.js            # Main React component
│   │   └── index.js          # Entry point for React
│   ├── .env                  # Environment variables for frontend (e.g., API keys)
│   ├── package.json          # Node.js dependencies for frontend
│   └── webpack.config.js     # Webpack configuration for frontend bundling
│
├── model/                    # NLP and AI models for the chatbot
│   ├── training/             # Scripts for training/fine-tuning models
│   │   ├── train_model.py    # Python script for training models
│   │   ├── preprocess.py     # Data preprocessing for training
│   │   └── evaluate.py       # Evaluation of trained models
│   ├── saved_models/         # Directory for storing trained models
│   ├── inference/            # Scripts for inference (e.g., chatbot predictions)
│   │   ├── chatbot_model.py  # Main chatbot model file
│   │   └── utils.py          # Utility functions for inference
│   ├── requirements.txt      # Python dependencies (e.g., transformers, nltk)
│   └── README.md             # Model-specific documentation
│
├── data/                     # External data (APIs, datasets, and other data sources)
│   ├── job_listings.json     # Data for job listings (may come from APIs)
│   ├── mentorship_data.json  # Data for mentorship matching
│   ├── events_data.json      # Data for community events
│   └── skillset_data.json    # Data for job skills and certifications
│
├── scripts/                  # Scripts for automation (data scraping, batch jobs)
│   ├── scrape_jobs.py        # Job data scraping scripts
│   ├── scrape_events.py      # Event data scraping scripts
│   └── preprocess_data.py    # Scripts for cleaning and processing data
│
├── tests/                    # Unit tests, integration tests
│   ├── backend/              # Backend tests
│   ├── frontend/             # Frontend tests
│   └── model/                # Model testing (e.g., chatbot accuracy)
│
├── .gitignore                # Git ignore file (to exclude node_modules, .env, etc.)
├── docker-compose.yml        # Docker Compose configuration (if using Docker)
├── Dockerfile                # Dockerfile for creating app container
├── README.md                 # Project overview and setup instructions
└── package.json              # Node.js dependencies for backend (Express.js)

