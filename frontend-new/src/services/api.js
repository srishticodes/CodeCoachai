import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interview API endpoints
export const interviewApi = {
  // Question management
  generateQuestion: async (data) => {
    const response = await api.post('/interview/questions/generate', data);
    return response.data;
  },

  getQuestions: async (params) => {
    const response = await api.get('/interview/questions', { params });
    return response.data;
  },

  // Solution submission and evaluation
  submitSolution: async (data) => {
    const response = await api.post('/interview/solutions/submit', data);
    return response.data;
  },

  // Hints and solutions
  getHint: async (questionId) => {
    const response = await api.get(`/interview/questions/${questionId}/hint`);
    return response.data;
  },

  getSolution: async (questionId) => {
    const response = await api.get(`/interview/questions/${questionId}/solution`);
    return response.data;
  },

  // User progress
  getUserProgress: async (params) => {
    const response = await api.get('/interview/progress', { params });
    return response.data;
  }
};

// Auth API endpoints
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default api; 