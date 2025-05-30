import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useInterview } from '../context/InterviewContext';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { interviewApi } from '../services/api';
<<<<<<< HEAD
=======
import { getLanguageTemplate } from '../services/codeTemplates';
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807

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
<<<<<<< HEAD
      const templates = {
        javascript: 'function solution(input) {\n  // Write your code here\n  \n}',
        python: 'def solution(input):\n    # Write your code here\n    pass',
        java: 'public class Solution {\n    public static void solution(String input) {\n        // Write your code here\n    }\n}',
        cpp: '#include <iostream>\n\nvoid solution(std::string input) {\n    // Write your code here\n}\n\nint main() {\n    return 0;\n}'
      };
      setCode(templates[question.language] || '');
=======
      try {
        setCode(getLanguageTemplate(question.language));
      } catch (error) {
        setError('Unsupported programming language');
      }
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
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
<<<<<<< HEAD
      console.log('Requesting hint for question:', question._id);
      const result = await getHint(question._id);
      console.log('Hint response:', result);
      if (!result || !result.hint) {
        console.error('Invalid hint response:', result);
        throw new Error('Invalid hint response from server');
      }
      setHints(prev => [...prev, result.hint]);
    } catch (err) {
      console.error('Error getting hint:', err);
      setError(err.message || 'Failed to get hint');
=======
      const result = await getHint(question._id);
      setHints(prev => [...prev, result.hint]);
    } catch (err) {
      setError(err.message);
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
    } finally {
      setLoading(false);
    }
  };

  const handleShowSolution = async () => {
    try {
      setLoading(true);
      setError(null);
<<<<<<< HEAD
      console.log('Fetching solution for question:', question._id);
      const result = await getSolution(question._id);
      console.log('Raw solution response:', result);
      
      if (!result || !result.explanation) {
        console.error('Invalid solution response:', result);
        throw new Error('Invalid solution response from server');
      }

      // Validate the explanation structure
      const requiredFields = ['overview', 'stepByStep', 'complexity', 'codeExplanation'];
      const missingFields = requiredFields.filter(field => !result.explanation[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields in solution:', missingFields);
        throw new Error(`Solution is missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('Solution data validated:', {
        hasOverview: !!result.explanation.overview,
        hasStepByStep: !!result.explanation.stepByStep,
        hasComplexity: !!result.explanation.complexity,
        hasCodeExplanation: !!result.explanation.codeExplanation
      });
      
      setSolution(result.explanation);
      setShowSolution(true);
    } catch (err) {
      console.error('Error fetching solution:', err);
      setError(err.message || 'Failed to get solution');
=======
      const result = await getSolution(question._id);
      setSolution(result.explanation);
      setShowSolution(true);
    } catch (err) {
      setError(err.message);
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
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

<<<<<<< HEAD
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

=======
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
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
<<<<<<< HEAD
                onClick={handleReturnToDashboard}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Return to Dashboard
              </button>
              <button
=======
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
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
<<<<<<< HEAD
            <h3 className="text-lg font-medium text-black">Test Cases</h3>
            {question?.testCases.map((testCase, index) => (
              <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium text-black">Input: {testCase.input}</p>
                <p className="text-sm text-black">Expected: {testCase.expectedOutput}</p>
                {output?.testResults?.[index] && (
                  <p className={`text-sm text-black ${
                    output.testResults[index].passed ? 'font-semibold' : 'font-semibold'
=======
            <h3 className="text-lg font-medium text-gray-900">Test Cases</h3>
            {question?.testCases.map((testCase, index) => (
              <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">Input: {testCase.input}</p>
                <p className="text-sm">Expected: {testCase.expectedOutput}</p>
                {output?.testResults?.[index] && (
                  <p className={`text-sm ${
                    output.testResults[index].passed ? 'text-green-600' : 'text-red-600'
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
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
<<<<<<< HEAD
              <h3 className="text-lg font-medium text-black">Feedback</h3>
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm text-black">{output.feedback}</p>
=======
              <h3 className="text-lg font-medium text-gray-900">Feedback</h3>
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm">{output.feedback}</p>
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
              </div>
            </div>
          )}

          {/* Hints */}
          {hints.length > 0 && (
            <div className="p-4 border-b">
<<<<<<< HEAD
              <h3 className="text-lg font-medium text-black">Hints</h3>
              {hints.map((hint, index) => (
                <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-black">Hint {index + 1}:</p>
                  <p className="text-sm text-black">{hint}</p>
=======
              <h3 className="text-lg font-medium text-gray-900">Hints</h3>
              {hints.map((hint, index) => (
                <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">Hint {index + 1}:</p>
                  <p className="text-sm">{hint}</p>
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
                </div>
              ))}
            </div>
          )}

          {/* Solution */}
          {showSolution && solution && (
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Solution</h3>
<<<<<<< HEAD
              {console.log('Rendering solution:', solution)}
              <div className="mt-2 space-y-4">
                {/* Overview */}
                <div className="p-2 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Overview</h4>
                  <p className="text-sm text-gray-600">{solution.overview || 'No overview available'}</p>
                </div>

                {/* Step by Step */}
                <div className="p-2 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Step by Step</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{solution.stepByStep || 'No step-by-step explanation available'}</p>
                </div>

                {/* Complexity */}
                <div className="p-2 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Complexity Analysis</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time Complexity:</span> {solution.complexity?.time || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Space Complexity:</span> {solution.complexity?.space || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Code Explanation */}
                <div className="p-2 bg-gray-50 rounded">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Code Explanation</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{solution.codeExplanation || 'No code explanation available'}</p>
                </div>
=======
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <pre className="text-sm whitespace-pre-wrap">{solution}</pre>
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
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