import { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const user = await authApi.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
          console.error('Auth check failed:', error);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    checkAuth();
  }, [state.token]);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { token, user } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { token, user } = await authApi.register(userData);
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 