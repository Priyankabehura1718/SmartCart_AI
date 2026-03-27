# Hybrid Deep Learning Framework for Fake Review Detection and Personalized Recommendation (SmartCart AI – AI-Powered Smart E-commerce Platform)

##  Overview

SmartCart AI is an intelligent multi-vendor e-commerce platform that enhances user experience using Artificial Intelligence.
It provides personalized product recommendations and detects fake reviews to improve trust and decision-making.

---

##  Features

*  AI-based Product Recommendation System
*  Fake Review Detection
*  Multi-vendor Product Management
*  User Authentication (Login/Register)
*  Cart Functionality
*  Personalized User Experience

---

##  AI Components

### 🔹 Recommendation System

* TF-IDF (Term Frequency - Inverse Document Frequency) + SVD_models
* Cosine Similarity for product matching

### 🔹 Fake Review Detection

* Machine Learning model trained on review text
* Detects and flags suspicious reviews

---

## Tech Stack

### Frontend

* React.js

### Backend

* Django (REST APIs)

### AI / ML

* Python
* Scikit-learn
* Pandas, NumPy

### Database

* SQLite

---

##  Project Structure

```
SmartCart_AI/
│
├── backend/
│   ├── main/
│   ├── serializers.py
│   ├── views.py
│
├── ai_model/
│   ├── recommended.py
│   ├── review.py
│   ├── tfidf_model.pkl
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│
├── db.sqlite3
└── README.md
```

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Priyankabehura1718/SmartCart_AI.git
cd SmartCart_AI
```

###  Backend Setup (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

## How It Works

1. User browses products
2. System analyzes product descriptions
3. TF-IDF converts text into vectors
4. Cosine similarity finds similar products
5. Fake review model analyzes reviews
6. Results displayed in frontend

---

## Future Improvements

* Deep learning-based recommendation system
* Real-time user behavior tracking
* Cloud deployment (AWS/GCP)
* Advanced fraud detection

---

## Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---



## Author

**Priyanka Behura**
B.Tech CSE 

GitHub: https://github.com/Priyankabehura1718

---
