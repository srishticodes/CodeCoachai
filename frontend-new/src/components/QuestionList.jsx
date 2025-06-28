import { useInterview } from '../context/InterviewContext';
import { interviewApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function QuestionList() {
  const {
    questions,
    filters,
    pagination,
    loading,
    error,
    updateFilters,
    updatePage
  } = useInterview();
  const [loadingStartPractice, setLoadingStartPractice] = useState(false);
  const [errorStartPractice, setErrorStartPractice] = useState(null);
  const navigate = useNavigate();

  const difficulties = ['easy', 'medium', 'hard'];
  const languages = ['javascript', 'python', 'java', 'cpp'];
  const categories = [
    'arrays',
    'strings',
    'linked-lists',
    'trees',
    'graphs',
    'dynamic-programming',
    'other'
  ];

  const handleStartPractice = async () => {
    setLoadingStartPractice(true);
    setErrorStartPractice(null);
    try {
      const data = {
        difficulty: filters.difficulty,
        language: filters.language,
        category: filters.category
      };
      const res = await interviewApi.generateQuestion(data);
      // Navigate to coding interface with questionId
      navigate(`/practice/${res.question._id}`, { state: { question: res.question } });
    } catch (err) {
      setErrorStartPractice(err.response?.data?.message || 'Failed to generate question');
    } finally {
      setLoadingStartPractice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-950 dark:via-primary-950 dark:to-secondary-950">
        <div className="container-modern py-20">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" text="Loading questions..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-950 dark:via-primary-950 dark:to-secondary-950">
        <div className="container-modern py-20">
          <div className="glass-card p-6 border-l-4 border-error-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-error-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Error</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-950 dark:via-primary-950 dark:to-secondary-950">
      <div className="container-modern py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Practice <span className="gradient-text">Coding Questions</span>
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Choose your preferences and start practicing with AI-generated coding challenges tailored to your skill level.
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Customize Your Practice</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Select your preferred difficulty, language, and category</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Difficulty Level</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => updateFilters({ difficulty: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-soft text-neutral-900 dark:text-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-neutral-800"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff} className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Programming Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilters({ language: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-soft text-neutral-900 dark:text-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-neutral-800"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang} className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Problem Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-soft text-neutral-900 dark:text-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-neutral-800"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                      {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-center pt-6">
              <button
                onClick={handleStartPractice}
                disabled={loadingStartPractice}
                className="btn-primary text-lg px-10 py-4 group"
              >
                {loadingStartPractice ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-3">Generating Question...</span>
                  </>
                ) : (
                  <>
                    <span>Start Practice</span>
                    <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              {errorStartPractice && (
                <div className="mt-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl">
                  <p className="text-error-600 dark:text-error-400 text-sm font-medium">{errorStartPractice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Available Questions</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Browse through our collection of coding challenges</p>
            </div>
            
            <div className="grid gap-6">
              {questions.map((question) => (
                <div
                  key={question._id}
                  className="glass-card p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/practice/${question._id}`, { state: { question } })}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">{question.title}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">{question.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className={`badge ${
                          question.difficulty === 'easy' ? 'badge-success' :
                          question.difficulty === 'medium' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                        <span className="badge badge-primary">
                          {question.language.charAt(0).toUpperCase() + question.language.slice(1)}
                        </span>
                        <span className="badge badge-secondary">
                          {question.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/practice/${question._id}`, { state: { question } });
                      }}
                      className="btn-primary ml-8 whitespace-nowrap group"
                    >
                      <span>Start Question</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-8">
              <button
                onClick={() => updatePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => updatePage(page)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      page === pagination.currentPage
                        ? 'bg-primary-600 text-white shadow-medium'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:shadow-soft'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => updatePage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 