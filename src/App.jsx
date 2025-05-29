import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import CodingInterface from './components/CodingInterface';
import QuestionList from './components/QuestionList';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InterviewProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <QuestionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/:questionId"
              element={
                <ProtectedRoute>
                  <CodingInterface />
                </ProtectedRoute>
              }
            />
          </Routes>
        </InterviewProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
