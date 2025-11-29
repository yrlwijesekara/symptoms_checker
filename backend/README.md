# AI Symptom Checker Backend

This is the Flask backend API for the AI Symptom Checker application.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/symptoms` - Get available symptoms and diseases
- `POST /api/predict` - Predict disease based on symptoms

### Prediction Request Format

```json
{
    "symptoms": ["fever", "cough", "fatigue"],
    "age": 30,
    "gender": "Male",
    "severity": "Moderate",
    "confidence_score": 85
}
```

### Prediction Response Format

```json
{
    "success": true,
    "prediction": {
        "predicted_disease": "Influenza",
        "confidence": 99.87,
        "top_3_predictions": [
            {"disease": "Influenza", "probability": 99.87},
            {"disease": "Common Cold", "probability": 0.13},
            {"disease": "Heart Attack", "probability": 0.00}
        ]
    }
}
```

## Files

- `app.py` - Main Flask application (production server)
- `best_symptom_checker_model.h5` - Trained TensorFlow model
- `preprocessing_objects.joblib` - Model preprocessing objects
- `AI_Symptom_Checker_Dataset.csv` - Training dataset
- `Untitled13.ipynb` - Model training notebook
- `requirements.txt` - Python dependencies
- `venv/` - Virtual environment