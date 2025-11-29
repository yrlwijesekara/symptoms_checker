import React from 'react';
import { ApiResponse } from '../types/api';
import './PredictionResult.css';

interface Props {
  result: ApiResponse;
  onReset: () => void;
  availableDiseases: string[];
}

const PredictionResult: React.FC<Props> = ({ result, onReset, availableDiseases }) => {
  const { prediction, input } = result;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild': return '#52c41a';
      case 'moderate': return '#faad14';
      case 'severe': return '#f5222d';
      default: return '#722ed1';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#52c41a';
    if (confidence >= 60) return '#faad14';
    return '#f5222d';
  };

  const formatSymptomName = (symptom: string) => {
    return symptom
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDiseaseIcon = (disease: string) => {
    const diseaseIcons: { [key: string]: string } = {
      'Common Cold': '🤧',
      'Influenza': '🤒',
      'Migraine': '🧠',
      'Heart Attack': '❤️',
      'Food Poisoning': '🤢',
    };
    return diseaseIcons[disease] || '🏥';
  };

  const getDiseaseDescription = (disease: string) => {
    const descriptions: { [key: string]: string } = {
      'Common Cold': 'A viral infection affecting the upper respiratory tract, causing mild symptoms.',
      'Influenza': 'A contagious respiratory illness caused by influenza viruses.',
      'Migraine': 'A neurological condition causing severe headaches and related symptoms.',
      'Heart Attack': 'A serious medical emergency requiring immediate attention.',
      'Food Poisoning': 'Illness caused by consuming contaminated or spoiled food.',
    };
    return descriptions[disease] || 'Please consult a healthcare professional for more information.';
  };

  const getRecommendation = (disease: string, confidence: number) => {
    if (disease === 'Heart Attack') {
      return {
        level: 'emergency',
        text: '🚨 SEEK IMMEDIATE MEDICAL ATTENTION! Call emergency services immediately.',
        color: '#f5222d'
      };
    }
    
    if (confidence >= 80) {
      return {
        level: 'high',
        text: 'Consider consulting a healthcare professional for proper diagnosis and treatment.',
        color: '#faad14'
      };
    }
    
    return {
      level: 'low',
      text: 'Monitor your symptoms. Consult a doctor if symptoms persist or worsen.',
      color: '#1890ff'
    };
  };

  const recommendation = getRecommendation(prediction.predicted_disease, prediction.confidence);

  return (
    <div className="prediction-result">
      <div className="result-header">
        <h2>🔍 Analysis Complete</h2>
        <button onClick={onReset} className="new-analysis-btn">
          ➕ New Analysis
        </button>
      </div>

      {/* Main Prediction */}
      <div className="main-prediction">
        <div className="disease-icon">
          {getDiseaseIcon(prediction.predicted_disease)}
        </div>
        <div className="disease-info">
          <h3>{prediction.predicted_disease}</h3>
          <p className="disease-description">
            {getDiseaseDescription(prediction.predicted_disease)}
          </p>
          <div className="confidence-badge" style={{ backgroundColor: getConfidenceColor(prediction.confidence) }}>
            {prediction.confidence.toFixed(1)}% Confidence
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`recommendation ${recommendation.level}`} style={{ borderColor: recommendation.color }}>
        <h4>💡 Recommendation</h4>
        <p style={{ color: recommendation.color }}>{recommendation.text}</p>
      </div>

      {/* Input Summary */}
      <div className="input-summary">
        <h4>📋 Your Information</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Age:</strong> {input.age} years
          </div>
          <div className="summary-item">
            <strong>Gender:</strong> {input.gender}
          </div>
          <div className="summary-item">
            <strong>Severity:</strong> 
            <span style={{ color: getSeverityColor(input.severity) }}> {input.severity}</span>
          </div>
          <div className="summary-item">
            <strong>Confidence:</strong> {input.confidence_score}%
          </div>
        </div>
        <div className="symptoms-summary">
          <strong>Symptoms:</strong>
          <div className="symptoms-list">
            {input.symptoms.map((symptom, index) => (
              <span key={index} className="symptom-tag">
                {formatSymptomName(symptom)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* All Predictions */}
      <div className="all-predictions">
        <h4>📊 All Possible Conditions</h4>
        <div className="predictions-list">
          {prediction.all_predictions.map((pred, index) => (
            <div 
              key={index} 
              className={`prediction-item ${index === 0 ? 'primary' : ''}`}
            >
              <div className="prediction-info">
                <span className="disease-icon-small">
                  {getDiseaseIcon(pred.disease)}
                </span>
                <span className="disease-name">{pred.disease}</span>
              </div>
              <div className="probability-bar">
                <div 
                  className="probability-fill"
                  style={{ 
                    width: `${pred.probability}%`,
                    backgroundColor: getConfidenceColor(pred.probability)
                  }}
                ></div>
              </div>
              <span className="probability-text">{pred.probability.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="result-disclaimer">
        <h4>⚠️ Important Notice</h4>
        <p>
          This AI analysis is for informational purposes only and should not replace professional medical advice, 
          diagnosis, or treatment. Always seek the advice of qualified healthcare providers with questions about 
          medical conditions. In case of a medical emergency, call your local emergency number immediately.
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;