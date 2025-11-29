export interface SymptomData {
  symptoms: string[];
  age: number;
  gender: 'Male' | 'Female';
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidence_score: number;
}

export interface PredictionResult {
  predicted_disease: string;
  confidence: number;
  all_predictions: Array<{
    disease: string;
    probability: number;
  }>;
  top_3_predictions: Array<{
    disease: string;
    probability: number;
  }>;
}

export interface ApiResponse {
  success: boolean;
  prediction: PredictionResult;
  input: SymptomData;
  error?: string;
}