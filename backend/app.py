from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from tensorflow import keras
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load model and preprocessing objects at startup
print("Loading model and preprocessing objects...")
try:
    model = keras.models.load_model('best_symptom_checker_model.h5')
    preprocessing_objects = joblib.load('preprocessing_objects.joblib')
    print("Model and preprocessing objects loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    preprocessing_objects = None

# Available symptoms (from your analysis)
AVAILABLE_SYMPTOMS = [
    'headache', 'runny_nose', 'blurred_vision', 'breathlessness', 
    'vomiting', 'sneezing', 'abdominal_pain', 'fatigue', 
    'fever', 'chest_pain', 'cough'
]

# Available diseases
AVAILABLE_DISEASES = [
    'Common Cold', 'Food Poisoning', 'Heart Attack', 'Influenza', 'Migraine'
]

def preprocess_input(symptoms, age, gender, confidence_score=85, severity='Moderate'):
    """
    Preprocess input data for prediction
    """
    if preprocessing_objects is None:
        raise ValueError("Preprocessing objects not loaded")
    
    # Extract preprocessing objects
    disease_encoder = preprocessing_objects['disease_encoder']
    gender_encoder = preprocessing_objects['gender_encoder']
    severity_mapping = preprocessing_objects['severity_mapping']
    scaler = preprocessing_objects['scaler']
    feature_columns = preprocessing_objects['feature_columns']
    symptom_columns = preprocessing_objects['symptom_columns']
    
    # Create a sample row with all zeros
    input_data = pd.DataFrame(0, index=[0], columns=feature_columns)
    
    # Set basic features
    input_data['Age'] = age
    input_data['Confidence Score (%)'] = confidence_score
    input_data['Severity_encoded'] = severity_mapping.get(severity, 1)  # Default to Moderate
    
    # Encode gender
    try:
        input_data['Gender_encoded'] = gender_encoder.transform([gender])[0]
    except:
        input_data['Gender_encoded'] = 0  # Default to first class
    
    # Set symptom features
    for symptom in symptoms:
        symptom_col = f'Symptom_{symptom.lower().replace(" ", "_")}'
        if symptom_col in symptom_columns:
            input_data[symptom_col] = 1
    
    # Scale only the numeric features (Age and Confidence Score) as per original training
    # Make a copy and scale only the numeric columns
    input_scaled = input_data.copy()
    numeric_features = ['Age', 'Confidence Score (%)']
    input_scaled[numeric_features] = scaler.transform(input_data[numeric_features])
    
    return input_scaled.values

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'preprocessing_loaded': preprocessing_objects is not None
    })

@app.route('/api/symptoms', methods=['GET'])
def get_available_symptoms():
    """Get list of available symptoms"""
    return jsonify({
        'symptoms': AVAILABLE_SYMPTOMS,
        'diseases': AVAILABLE_DISEASES
    })

@app.route('/api/predict', methods=['POST'])
def predict_disease():
    """
    Predict disease based on symptoms and patient information
    
    Expected JSON payload:
    {
        "symptoms": ["fever", "cough", "fatigue"],
        "age": 25,
        "gender": "Male",
        "confidence_score": 85,
        "severity": "Moderate"
    }
    """
    try:
        if model is None or preprocessing_objects is None:
            return jsonify({'error': 'Model not loaded properly'}), 500
        
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['symptoms', 'age', 'gender']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        symptoms = data['symptoms']
        age = data['age']
        gender = data['gender']
        confidence_score = data.get('confidence_score', 85)
        severity = data.get('severity', 'Moderate')
        
        # Validate input
        if not isinstance(symptoms, list) or len(symptoms) == 0:
            return jsonify({'error': 'Symptoms must be a non-empty list'}), 400
        
        if not isinstance(age, (int, float)) or age < 0 or age > 120:
            return jsonify({'error': 'Age must be a number between 0 and 120'}), 400
        
        if gender not in ['Male', 'Female']:
            return jsonify({'error': 'Gender must be either "Male" or "Female"'}), 400
        
        if severity not in ['Mild', 'Moderate', 'Severe']:
            return jsonify({'error': 'Severity must be "Mild", "Moderate", or "Severe"'}), 400
        
        # Preprocess input
        input_data = preprocess_input(symptoms, age, gender, confidence_score, severity)
        
        # Make prediction
        prediction_proba = model.predict(input_data, verbose=0)
        predicted_class = np.argmax(prediction_proba, axis=1)[0]
        
        # Get disease encoder
        disease_encoder = preprocessing_objects['disease_encoder']
        
        # Get predicted disease and confidence
        predicted_disease = disease_encoder.inverse_transform([predicted_class])[0]
        confidence = float(prediction_proba[0][predicted_class] * 100)
        
        # Get all predictions with probabilities
        all_predictions = []
        for i, disease in enumerate(disease_encoder.classes_):
            all_predictions.append({
                'disease': disease,
                'probability': float(prediction_proba[0][i] * 100)
            })
        
        # Sort predictions by probability (highest first)
        all_predictions.sort(key=lambda x: x['probability'], reverse=True)
        
        # Get top 3 predictions
        top_3_predictions = all_predictions[:3]
        
        return jsonify({
            'success': True,
            'prediction': {
                'predicted_disease': predicted_disease,
                'confidence': round(confidence, 2),
                'all_predictions': all_predictions,
                'top_3_predictions': top_3_predictions
            },
            'input': {
                'symptoms': symptoms,
                'age': age,
                'gender': gender,
                'severity': severity,
                'confidence_score': confidence_score
            }
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['POST'])
def test_prediction():
    """Test endpoint with sample data"""
    sample_data = {
        "symptoms": ["fever", "cough", "fatigue"],
        "age": 30,
        "gender": "Male",
        "confidence_score": 85,
        "severity": "Moderate"
    }
    
    # Use the predict function
    with app.test_request_context(json=sample_data):
        app.config['TESTING'] = True
        return predict_disease()

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Available symptoms: {AVAILABLE_SYMPTOMS}")
    print(f"Available diseases: {AVAILABLE_DISEASES}")
    app.run(debug=True, host='0.0.0.0', port=5000)