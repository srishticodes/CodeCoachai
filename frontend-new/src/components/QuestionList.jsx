import { useInterview } from '../context/InterviewContext';
import { interviewApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => updateFilters({ difficulty: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={filters.language}
              onChange={(e) => updateFilters({ language: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleStartPractice}
          disabled={loadingStartPractice}
          className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loadingStartPractice ? 'Generating Question...' : 'Start Practice'}
        </button>
        {errorStartPractice && (
          <div className="mt-2 text-red-600 text-sm">{errorStartPractice}</div>
        )}
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {questions.map((question) => (
          <div
            key={question._id}
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{question.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{question.description}</p>
                <div className="mt-2 flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {question.difficulty}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {question.language}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {question.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {/* Handle start question */}}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Question
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => updatePage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => updatePage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 