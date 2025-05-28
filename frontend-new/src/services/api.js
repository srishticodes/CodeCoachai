import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get available questions for a language and difficulty
export const getQuestions = async (language, difficulty) => {
  try {
    const response = await api.get(`/code/questions/${language}/${difficulty}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch questions');
  }
};

// Get a specific question
export const getQuestion = async (language, questionId, difficulty) => {
  try {
    const response = await api.get(`/code/questions/${language}/${difficulty}/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch question');
  }
};

// Execute code for a specific question
export const executeCode = async (code, language, questionId, difficulty) => {
  try {
    const response = await api.post('/code/execute', {
      code,
      language,
      questionId,
      difficulty
    });
    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);
    throw new Error(error.response?.data?.message || 'Failed to execute code');
  }
};

export const getLanguageTemplate = async (language) => {
  try {
    const response = await api.get(`/code/template/${language}`);
    return response.data.template;
  } catch (error) {
    console.error('Error getting language template:', error);
    throw new Error(error.response?.data?.error || 'Failed to get language template');
  }
};

export const getCodeFeedback = async (code, language, question, testResults) => {
  try {
    const response = await api.post('/ai/feedback', {
      code,
      language,
      question,
      testResults,
    });
    return {
      feedback: response.data.feedback,
      error: null
    };
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    return {
      feedback: null,
      error: error.response?.data?.error || 'Failed to get AI feedback'
    };
  }
};

export const getCodeExplanation = async (code, language, question) => {
  try {
    const response = await api.post('/ai/explanation', {
      code,
      language,
      question,
    });
    return {
      explanation: response.data.explanation,
      error: null
    };
  } catch (error) {
    console.error('Error getting code explanation:', error);
    return {
      explanation: null,
      error: error.response?.data?.error || 'Failed to get code explanation'
    };
  }
}; 