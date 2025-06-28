import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import CodingInterface from './components/CodingInterface';
import QuestionList from './components/QuestionList';
import LandingPage from './components/LandingPage';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';

// Component to handle public route protection
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// Component for the main introduction page (always shows intro content)
function MainLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-950 dark:via-primary-950 dark:to-secondary-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-accent-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Use main Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 container-modern">
        <div className="text-center py-20 md:py-32 pt-16">
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-glow animate-float">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                <span className="block">Master Your</span>
                <span className="block gradient-text">Coding Skills</span>
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                Practice with AI-powered coding questions, get instant feedback, and improve your problem-solving skills with personalized guidance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 group">
                <span>Start Free Trial</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="stats-card">
                <div className="text-3xl font-bold gradient-text mb-2">500+</div>
                <div className="text-neutral-600 dark:text-neutral-400">AI Questions</div>
              </div>
              <div className="stats-card">
                <div className="text-3xl font-bold gradient-text mb-2">95%</div>
                <div className="text-neutral-600 dark:text-neutral-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container-modern py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Why Choose <span className="gradient-text">CodeCoach.ai</span>?
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Our AI-powered platform provides personalized learning experiences to help you master coding interviews.
          </p>
        </div>

        <div className="card-grid">
          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">AI-Powered Questions</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Practice with intelligent questions that adapt to your skill level and provide personalized feedback.
            </p>
          </div>

          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Instant Feedback</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Get real-time feedback on your solutions with detailed explanations and optimization suggestions.
            </p>
          </div>

          <div className="feature-card">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Progress Tracking</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Monitor your progress with detailed analytics and track your improvement over time.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container-modern py-20">
        <div className="text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already improving their skills with CodeCoach.ai
            </p>
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <InterviewProvider>
          <Routes>
            {/* Main introduction page - always shows intro content */}
            <Route
              path="/"
              element={<MainLandingPage />}
            />
            <Route
              path="/home"
              element={<MainLandingPage />}
            />
            
            {/* Welcome back page for authenticated users */}
            <Route
              path="/welcome"
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            
            {/* Auth routes with protection */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Layout>
                    <Login />
                  </Layout>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Layout>
                    <Register />
                  </Layout>
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <QuestionList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/:questionId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CodingInterface />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route
              path="*"
              element={
                <Navigate to="/" replace />
              }
            />
          </Routes>
        </InterviewProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
