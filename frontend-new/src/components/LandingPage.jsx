import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // If user is authenticated, show welcome and menu
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full">
          <nav className="flex items-center justify-end px-8 py-4">
            <div className="relative" ref={menuRef}>
              <button
                className="p-2 rounded hover:bg-gray-100 focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open menu"
              >
                <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 divide-y divide-gray-200">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => { setMenuOpen(false); navigate('/questions'); }}
                  >
                    Practice
                  </button>
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                    >
                      Profile Settings
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      onClick={() => { setMenuOpen(false); logout(); navigate('/'); }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {user.name}!</h1>
          <Link
            to="/questions"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Practicing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-end px-8 py-4">
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { setMenuOpen(false); navigate('/login'); }}
              >
                View Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { setMenuOpen(false); navigate('/register'); }}
              >
                Practice
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
<<<<<<< HEAD
             <span className="block">CodeCoach.ai</span>
=======
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
              <span className="block">Master Your Coding</span>
              <span className="block text-indigo-600">Interview Skills</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Practice with AI-powered coding questions, get instant feedback, and improve your problem-solving skills with personalized guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to ace your interviews
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI-Powered Questions</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get personalized coding questions generated by advanced AI, tailored to your skill level and learning goals.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Instant Feedback</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Receive immediate feedback on your solutions, including performance analysis and optimization suggestions.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Progress Tracking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Monitor your improvement over time with detailed analytics and performance metrics.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Smart Hints</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get intelligent hints when you're stuck, helping you learn problem-solving strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start your interview preparation?</h2>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 