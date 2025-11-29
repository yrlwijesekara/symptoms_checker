import React, { useState } from 'react';
import { SymptomData } from '../types/api';
import './SymptomForm.css';

interface Props {
  availableSymptoms: string[];
  onSubmit: (data: SymptomData) => void;
  loading: boolean;
}

const SymptomForm: React.FC<Props> = ({ availableSymptoms, onSubmit, loading }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [confidenceScore, setConfidenceScore] = useState<number>(85);

  const formatSymptomName = (symptom: string) => {
    return symptom
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    const symptomData: SymptomData = {
      symptoms: selectedSymptoms,
      age,
      gender,
      severity,
      confidence_score: confidenceScore,
    };

    onSubmit(symptomData);
  };

  return (
    <div className="symptom-form-container">
      <h2>Tell Us About Your Symptoms</h2>
      <p>Select your symptoms and provide some basic information for accurate analysis.</p>
      
      <form onSubmit={handleSubmit} className="symptom-form">
        
        {/* Symptoms Selection */}
        <div className="form-section">
          <h3>Symptoms</h3>
          <p className="section-description">Select all symptoms you are experiencing:</p>
          <div className="symptoms-grid">
            {availableSymptoms.map((symptom) => (
              <label key={symptom} className="symptom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                />
                <span className="checkmark"></span>
                {formatSymptomName(symptom)}
              </label>
            ))}
          </div>
          {selectedSymptoms.length > 0 && (
            <div className="selected-symptoms">
              <strong>Selected:</strong> {selectedSymptoms.map(formatSymptomName).join(', ')}
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                min="0"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Symptom Details */}
        <div className="form-section">
          <h3>Symptom Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severity">Severity</label>
              <select
                id="severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'Mild' | 'Moderate' | 'Severe')}
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="confidence">Confidence Score ({confidenceScore}%)</label>
              <input
                type="range"
                id="confidence"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                min="0"
                max="100"
                step="5"
              />
              <small>How confident are you about your symptoms?</small>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading || selectedSymptoms.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Analyzing...
              </>
            ) : (
              <>
                🔍 Analyze Symptoms
              </>
            )}
          </button>
        </div>
      </form>

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>
          <strong>Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical advice. 
          Always consult with a healthcare provider for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default SymptomForm;