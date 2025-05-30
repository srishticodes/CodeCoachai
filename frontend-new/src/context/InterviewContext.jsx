import { createContext, useContext, useReducer, useEffect } from 'react';
import { interviewApi } from '../services/api.js';

const InterviewContext = createContext();

const initialState = {
  questions: [],
  currentQuestion: null,
  userProgress: [],
  loading: false,
  error: null,
  filters: {
    difficulty: 'medium',
    language: 'javascript',
    category: 'arrays',
    page: 1,
    limit: 10
  },
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1
  }
};

function interviewReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload.questions,
        pagination: {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.page
        }
      };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'SET_USER_PROGRESS':
      return { ...state, userProgress: action.payload };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload, page: 1 }
      };
    case 'UPDATE_PAGE':
      return {
        ...state,
        filters: { ...state.filters, page: action.payload }
      };
    default:
      return state;
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  // Fetch questions when filters change
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const data = await interviewApi.getQuestions(state.filters);
        dispatch({ type: 'SET_QUESTIONS', payload: data });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchQuestions();
  }, [state.filters]);

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const data = await interviewApi.getUserProgress();
        dispatch({ type: 'SET_USER_PROGRESS', payload: data.progress });
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchUserProgress();
  }, []);

  const generateNewQuestion = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { question } = await interviewApi.generateQuestion(state.filters);
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
      return question;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitSolution = async (questionId, code, language) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await interviewApi.submitSolution({
        questionId,
        code,
        language
      });
      
      // Update user progress
      const progressData = await interviewApi.getUserProgress();
      dispatch({ type: 'SET_USER_PROGRESS', payload: progressData.progress });
      
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getHint = async (questionId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await interviewApi.getHint(questionId);
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getSolution = async (questionId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await interviewApi.getSolution(questionId);
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    generateNewQuestion,
    submitSolution,
    getHint,
    getSolution,
    updateFilters: (filters) => dispatch({ type: 'UPDATE_FILTERS', payload: filters }),
    updatePage: (page) => dispatch({ type: 'UPDATE_PAGE', payload: page })
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
} 