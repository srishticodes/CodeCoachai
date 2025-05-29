import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useInterview } from '../context/InterviewContext';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { interviewApi } from '../services/api';
import { getLanguageTemplate } from '../services/codeTemplates';

export default function CodingInterface() {
  const { submitSolution, getHint, getSolution } = useInterview();
  const location = useLocation();
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [question, setQuestion] = useState(location.state?.question || null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hints, setHints] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState(null);
  const [solved, setSolved] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  // Fetch question by ID if not present (e.g., on page refresh)
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await interviewApi.getQuestions({ _id: questionId });
        setQuestion(res.questions[0]);
      } catch (err) {
        setError('Failed to load question');
      } finally {
        setLoading(false);
      }
    };
    if (!question && questionId) {
      fetchQuestion();
    }
  }, [question, questionId]);

  // Set initial code template based on language
  useEffect(() => {
    if (question?.language) {
      try {
        setCode(getLanguageTemplate(question.language));
      } catch (error) {
        setError('Unsupported programming language');
      }
    }
  }, [question?.language]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await submitSolution(question._id, code, question.language);
      setOutput(result.evaluation);
      if (result.evaluation.isCorrect) {
        setSolved(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetHint = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getHint(question._id);
      setHints(prev => [...prev, result.hint]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSolution = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSolution(question._id);
      setSolution(result.explanation);
      setShowSolution(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setLoadingNext(true);
    setError(null);
    try {
      // Use previous question's filters if available, else defaults
      const data = {
        difficulty: question?.difficulty || 'medium',
        language: question?.language || 'javascript',
        category: question?.category || 'arrays'
      };
      const res = await interviewApi.generateQuestion(data);
      // Navigate to new question
      navigate(`/practice/${res.question._id}`, { state: { question: res.question } });
      // Reset state for new question
      setQuestion(res.question);
      setCode('');
      setOutput(null);
      setHints([]);
      setShowSolution(false);
      setSolution(null);
      setSolved(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate next question');
    } finally {
      setLoadingNext(false);
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Question Description */}
      <div className="bg-white p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">{question?.title}</h2>
        <p className="mt-2 text-gray-600">{question?.description}</p>
        <div className="mt-4 flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {question?.difficulty}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {question?.language}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={question?.language}
              value={code}
              onChange={setCode}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                readOnly: solved
              }}
            />
          </div>
          {/* Action Buttons */}
          <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
            <div className="space-x-2">
              <button
                onClick={handleGetHint}
                disabled={loading || solved}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Get Hint
              </button>
              <button
                onClick={handleShowSolution}
                disabled={loading || showSolution}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Show Solution
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={loading || solved}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {solved ? 'Solved!' : loading ? 'Submitting...' : 'Submit Solution'}
              </button>
              {(solved || showSolution) && (
                <button
                  onClick={handleNextQuestion}
                  disabled={loadingNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loadingNext ? 'Loading...' : 'Next Question'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-1/3 border-l bg-white flex flex-col">
          {/* Test Cases */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Test Cases</h3>
            {question?.testCases.map((testCase, index) => (
              <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">Input: {testCase.input}</p>
                <p className="text-sm">Expected: {testCase.expectedOutput}</p>
                {output?.testResults?.[index] && (
                  <p className={`text-sm ${
                    output.testResults[index].passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {output.testResults[index].passed ? '✓ Passed' : '✗ Failed'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Feedback */}
          {output && (
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Feedback</h3>
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm">{output.feedback}</p>
              </div>
            </div>
          )}

          {/* Hints */}
          {hints.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Hints</h3>
              {hints.map((hint, index) => (
                <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">Hint {index + 1}:</p>
                  <p className="text-sm">{hint}</p>
                </div>
              ))}
            </div>
          )}

          {/* Solution */}
          {showSolution && solution && (
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Solution</h3>
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <pre className="text-sm whitespace-pre-wrap">{solution}</pre>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 border-b">
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 