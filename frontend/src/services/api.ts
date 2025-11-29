import axios from 'axios';
import { SymptomData, ApiResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Get available symptoms and diseases
  getSymptoms: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/symptoms`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch available symptoms');
    }
  },

  // Check API health
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  },

  // Predict disease based on symptoms
  predictDisease: async (symptomData: SymptomData): Promise<ApiResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, symptomData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Prediction failed');
      }
      throw new Error('Network error occurred');
    }
  },
};