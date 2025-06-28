import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, interviewApi } from '../services/api';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import LoadingSpinner from './LoadingSpinner';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    averageScore: 0
  });
  const [profile, setProfile] = useState({
    skillLevel: 'beginner',
    preferredLanguage: 'javascript'
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Debug logging
  console.log('Dashboard render:', { user, loading, dashboardLoading, error });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        console.log('No user found, skipping dashboard data fetch');
        setDashboardLoading(false);
        return;
      }
      
      try {
        console.log('Fetching dashboard data for user:', user);
        setDashboardLoading(true);
        setError(null);
        
        // Get current user data which includes profile stats
        const { user: currentUser } = await authApi.getCurrentUser();
        console.log('Current user data:', currentUser);
        
        // Get total questions count
        const { total: totalQuestions } = await interviewApi.getTotalQuestions();
        console.log('Total questions:', totalQuestions);
        
        // Update stats from user profile and total questions
        setStats({
          totalQuestions,
          completedQuestions: currentUser.profile?.completedQuestions?.length || 0,
          averageScore: currentUser.profile?.averageScore || 0
        });

        // Update profile state with current values
        setProfile({
          skillLevel: currentUser.profile?.skillLevel || 'beginner',
          preferredLanguage: currentUser.profile?.preferredLanguage || 'javascript'
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleProfileChange = async (field, value) => {
    try {
      setUpdating(true);
      setError(null);
      
      // Update local state immediately for better UX
      const updatedProfile = { ...profile, [field]: value };
      setProfile(updatedProfile);
      
      // Send update to backend
      const { user: updatedUser } = await authApi.updateProfile({
        skillLevel: updatedProfile.skillLevel,
        preferredLanguage: updatedProfile.preferredLanguage
      });

      // Update stats with new user data
      setStats({
        totalQuestions: stats.totalQuestions,
        completedQuestions: updatedUser.profile?.completedQuestions?.length || 0,
        averageScore: updatedUser.profile?.averageScore || 0
      });

    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile settings');
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

  // Show loading spinner while auth is loading
  if (loading) {
    console.log('Auth loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Show loading spinner while dashboard data is loading
  if (dashboardLoading) {
    console.log('Dashboard loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your data..." />
      </div>
    );
  }

  console.log('Rendering dashboard content');

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-950 dark:via-primary-950 dark:to-secondary-950">
      <div className="container-modern py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Welcome back, <span className="gradient-text">{user?.name || 'Developer'}!</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Ready to continue your coding journey? Let's practice some algorithms!
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 glass-card p-4 border-l-4 border-error-500"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-error-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-error-700 dark:text-error-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="text-center">
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-2">{stats.totalQuestions}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Total Questions</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-2">{stats.completedQuestions}</div>
              <div className="text-neutral-600 dark:text-neutral-400">Completed Questions</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-2">{stats.averageScore}%</div>
              <div className="text-neutral-600 dark:text-neutral-400">Average Score</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={handleStartPractice}
                  size="lg"
                  className="w-full"
                  icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                >
                  Start Practice Session
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/questions')}
                    icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  >
                    View All Questions
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => window.location.reload()}
                    icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  >
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={profile.skillLevel}
                    onChange={(e) => handleProfileChange('skillLevel', e.target.value)}
                    disabled={updating}
                    className="select-modern w-full"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={profile.preferredLanguage}
                    onChange={(e) => handleProfileChange('preferredLanguage', e.target.value)}
                    disabled={updating}
                    className="select-modern w-full"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="primary">
                    Skill Level: {profile.skillLevel}
                  </Badge>
                  <Badge variant="secondary">
                    Language: {profile.preferredLanguage}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {updating && (
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Updating profile...</span>
                </div>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No recent activity yet. Start practicing to see your progress!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 