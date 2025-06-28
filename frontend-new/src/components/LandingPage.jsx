import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export default function LandingPage() {
  const { user } = useAuth();

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

      {/* Welcome Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] pt-16">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Welcome back, <span className="gradient-text">{user?.name}!</span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Ready to continue your coding journey? Let's practice some algorithms!
            </p>
          </div>
          <Link
            to="/questions"
            className="btn-primary text-lg px-8 py-4 group"
          >
            <span>Start Practicing</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 