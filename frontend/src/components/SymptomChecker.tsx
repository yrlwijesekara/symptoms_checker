import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { SymptomData, ApiResponse } from '../types/api';
import SymptomForm from './SymptomForm';
import PredictionResult from './PredictionResult';
import './SymptomChecker.css';

const SymptomChecker: React.FC = () => {
  const [availableSymptoms, setAvailableSymptoms] = useState<string[]>([]);
  const [availableDiseases, setAvailableDiseases] = useState<string[]>([]);
  const [predictionResult, setPredictionResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check API status and load available symptoms
    const initializeApp = async () => {
      try {
        setApiStatus('checking');
        
        // Health check
        const healthData = await apiService.healthCheck();
        if (healthData.status === 'healthy') {
          setApiStatus('online');
          
          // Load available symptoms and diseases
          const symptomsData = await apiService.getSymptoms();
          setAvailableSymptoms(symptomsData.symptoms || []);
          setAvailableDiseases(symptomsData.diseases || []);
        } else {
          setApiStatus('offline');
          setError('API is not responding properly');
        }
      } catch (err) {
        setApiStatus('offline');
        setError('Cannot connect to the API. Please make sure the backend server is running.');
        console.error('API initialization error:', err);
      }
    };

    initializeApp();
  }, []);

  const handlePrediction = async (symptomData: SymptomData) => {
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const result = await apiService.predictDisease(symptomData);
      setPredictionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setError(null);
  };

  if (apiStatus === 'checking') {
    return (
      <div className="symptom-checker">
        <div className="loading-card">
          <div className="spinner"></div>
          <h3>Connecting to AI System...</h3>
          <p>Please wait while we establish connection with the symptom checker.</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'offline') {
    return (
      <div className="symptom-checker">
        <div className="error-card">
          <h3>🚫 Service Unavailable</h3>
          <p>{error}</p>
          <p>Please ensure the Flask backend is running on http://localhost:5000</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="symptom-checker">
      <div className="status-indicator online">
        <span className="status-dot"></span>
        AI System Online
      </div>
      
      {!predictionResult && !loading && (
        <SymptomForm
          availableSymptoms={availableSymptoms}
          onSubmit={handlePrediction}
          loading={loading}
        />
      )}

      {loading && (
        <div className="loading-card">
          <div className="spinner"></div>
          <h3>Analyzing Symptoms...</h3>
          <p>Our AI is processing your symptoms to provide accurate health insights.</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-card">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={handleReset} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {predictionResult && !loading && (
        <PredictionResult 
          result={predictionResult} 
          onReset={handleReset}
          availableDiseases={availableDiseases}
        />
      )}
    </div>
  );
};

export default SymptomChecker;