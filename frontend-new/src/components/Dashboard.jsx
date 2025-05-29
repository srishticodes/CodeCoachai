import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function Dashboard() {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    averageScore: 0
  });
  const [profile, setProfile] = useState({
    skillLevel: user?.profile?.skillLevel || 'beginner',
    preferredLanguage: user?.profile?.preferredLanguage || 'javascript'
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setError(null);
        const response = await authApi.getUserStats();
        setStats({
          totalQuestions: response.totalQuestions,
          completedQuestions: response.completedQuestions,
          averageScore: response.averageScore
        });
      } catch (err) {
        setError('Failed to fetch user statistics');
        console.error('Error fetching stats:', err);
        // Fallback to mock data if API fails
        setStats({
          totalQuestions: 50,
          completedQuestions: user?.profile?.completedQuestions?.length || 0,
          averageScore: user?.profile?.averageScore || 0
        });
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const handleProfileChange = async (field, value) => {
    try {
      setUpdating(true);
      setError(null);
      const updatedProfile = { ...profile, [field]: value };
      
      // Update profile in backend
      const response = await authApi.updateProfile({
        profile: updatedProfile
      });
      
      // Update local state and context
      setProfile(updatedProfile);
      updateUser({ ...user, profile: updatedProfile });
      
      console.log('Profile updated successfully:', response);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Failed to update profile:', error);
      // Revert local state on error
      setProfile({
        skillLevel: user?.profile?.skillLevel || 'beginner',
        preferredLanguage: user?.profile?.preferredLanguage || 'javascript'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleStartPractice = () => {
    navigate('/questions');
  };

  const handleBeginnerQuestions = () => {
    navigate('/questions?difficulty=beginner');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Questions
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.totalQuestions}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Completed Questions
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.completedQuestions}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Average Score
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.averageScore}%
              </dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={handleStartPractice}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start Practice
              </button>
              <button
                onClick={handleBeginnerQuestions}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Beginner Questions
              </button>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Skill Level
                </label>
                <select
                  value={profile.skillLevel}
                  onChange={(e) => handleProfileChange('skillLevel', e.target.value)}
                  disabled={updating}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Language
                </label>
                <select
                  value={profile.preferredLanguage}
                  onChange={(e) => handleProfileChange('preferredLanguage', e.target.value)}
                  disabled={updating}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 