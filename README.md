# AI Symptom Checker

A complete web application that uses machine learning to predict diseases based on symptoms. The system consists of a Flask backend API and a React frontend interface.

## Project Structure

```
symptoms_checker/
├── backend/                 # Flask API backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── venv/              # Python virtual environment
│   ├── *.h5               # Trained ML model
│   ├── *.joblib           # Preprocessing objects
│   └── README.md          # Backend documentation
├── frontend/               # React TypeScript frontend
│   ├── src/               # Source code
│   ├── public/            # Public assets
│   ├── package.json       # Node.js dependencies
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## Features

- **AI-Powered Predictions**: Uses a trained neural network to predict diseases
- **Modern UI**: Beautiful, responsive React interface
- **Real-time Analysis**: Instant predictions with confidence scores
- **11 Symptoms Supported**: Fever, cough, fatigue, headache, and more
- **5 Disease Categories**: Common Cold, Influenza, Migraine, Heart Attack, Food Poisoning
- **Safety Features**: Emergency warnings for serious conditions
- **Professional Design**: Glassmorphism UI with smooth animations

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate
```

3. Install dependencies (if needed):
```bash
pip install -r requirements.txt
```

4. Start the Flask server:
```bash
python app.py
```

Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if needed):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend runs on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Select your symptoms from the available options
3. Enter your age, gender, and symptom severity
4. Click "Analyze Symptoms" to get AI-powered predictions
5. View detailed results with confidence scores and recommendations

## API Documentation

### Health Check
```
GET /api/health
```

### Get Available Symptoms
```
GET /api/symptoms
```

### Predict Disease
```
POST /api/predict
Content-Type: application/json

{
    "symptoms": ["fever", "cough"],
    "age": 25,
    "gender": "Male",
    "severity": "Moderate",
    "confidence_score": 85
}
```

## Technology Stack

### Backend
- **Flask** - Web framework
- **TensorFlow** - Machine learning
- **scikit-learn** - Data preprocessing
- **pandas/numpy** - Data handling

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **CSS3** - Modern styling with glassmorphism
- **Axios** - API communication

## Model Information

<img width="1894" height="909" alt="image" src="https://github.com/user-attachments/assets/7c4628db-6def-4c01-a0ef-7040b4f5a993" />

<img width="1895" height="907" alt="image" src="https://github.com/user-attachments/assets/d8483340-4cd3-40fb-803e-8493e6af6c4d" />


The AI model is a neural network trained on a dataset of 1000+ patient records with:
- **Input Features**: Age, gender, symptoms, severity, confidence
- **Architecture**: Dense layers with dropout regularization
- **Accuracy**: High precision for common conditions
- **Output**: Disease prediction with confidence percentage

## Disclaimer

This tool is for informational purposes only and should not replace professional medical advice. Always consult with healthcare providers for proper diagnosis and treatment. In case of emergency, call your local emergency number immediately.

## License

This project is for educational and demonstration purposes.
