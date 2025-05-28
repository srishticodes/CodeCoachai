import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode, getQuestions, getQuestion } from '../services/api.js';
import toast from 'react-hot-toast';
import { Play, Loader2, AlertCircle, CheckCircle2, HelpCircle, Clock, Database } from 'lucide-react';

const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.EASY);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  // Load questions when language or difficulty changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questions = await getQuestions(language, difficulty);
        setQuestions(questions);
        if (questions.length > 0) {
          handleQuestionSelect(questions[0].id);
        }
      } catch (error) {
        toast.error('Failed to load questions');
      }
    };
    loadQuestions();
  }, [language, difficulty]);

  // Load question details when selected
  const handleQuestionSelect = async (questionId) => {
    try {
      const question = await getQuestion(language, questionId, difficulty);
      setCurrentQuestion(question);
      setCode(''); // Clear previous code
      setOutput(null); // Clear previous output
      setEvaluation(null); // Clear previous evaluation
    } catch (error) {
      toast.error('Failed to load question');
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(''); // Clear code when language changes
    setOutput(null); // Clear output
    setEvaluation(null); // Clear evaluation
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    setCode(''); // Clear code when difficulty changes
    setOutput(null); // Clear output
    setEvaluation(null); // Clear evaluation
  };

  const handleRunCode = async () => {
    if (!currentQuestion) {
      toast.error('Please select a question first');
      return;
    }

    setLoading(true);
    setOutput(null);
    setEvaluation(null);

    try {
      const result = await executeCode(code, language, currentQuestion.id, difficulty);
      setOutput(result.results);
      setEvaluation(result.evaluation);

      if (result.evaluation.isCorrect) {
        toast.success('Solution is correct!');
      } else {
        toast.error('Solution needs improvement');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to execute code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Question Selection */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="select select-bordered w-40"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="select select-bordered w-40"
          >
            <option value={DIFFICULTY_LEVELS.EASY}>Easy</option>
            <option value={DIFFICULTY_LEVELS.MEDIUM}>Medium</option>
            <option value={DIFFICULTY_LEVELS.HARD}>Hard</option>
          </select>

          <select
            value={currentQuestion?.id || ''}
            onChange={(e) => handleQuestionSelect(parseInt(e.target.value))}
            className="select select-bordered flex-1"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunCode}
            disabled={loading || !currentQuestion}
            className="btn btn-primary"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run Code
          </button>
        </div>

        {currentQuestion && (
          <div className="prose dark:prose-invert max-w-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{currentQuestion.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </span>
              </div>
            </div>
            <p className="mb-4">{currentQuestion.description}</p>

            {/* Complexity Information */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Time Complexity</span>
                </div>
                <p className="text-sm">{currentQuestion.timeComplexity}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Space Complexity</span>
                </div>
                <p className="text-sm">{currentQuestion.spaceComplexity}</p>
              </div>
            </div>

            {/* Test Cases */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Test Cases:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <p className="text-sm">
                      <span className="font-medium">Input:</span> {testCase.input}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Expected:</span>{' '}
                      {testCase.expected}
                    </p>
                    {testCase.explanation && (
                      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                        {testCase.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            {currentQuestion.hints && currentQuestion.hints.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Hints:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output and Evaluation */}
      {(output || evaluation) && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {evaluation && (
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-2">
                {evaluation.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {evaluation.isCorrect ? 'Solution is Correct!' : 'Solution Needs Improvement'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {evaluation.explanation}
                  </p>

                  {/* Complexity Assessment */}
                  <div className="mt-3 space-y-2">
                    <h5 className="text-sm font-medium">Complexity Assessment:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Time Complexity</p>
                        </div>
                        <div className="text-sm">
                          <p>Expected: {evaluation.timeComplexity.expected}</p>
                          <p>Actual: {evaluation.timeComplexity.actual}</p>
                          <p className={`text-sm ${evaluation.timeComplexity.meetsExpectation ? 'text-green-500' : 'text-red-500'}`}>
                            {evaluation.timeComplexity.meetsExpectation ? '✓ Meets expectation' : '✗ Does not meet expectation'}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Database className="w-4 h-4 text-blue-500" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Space Complexity</p>
                        </div>
                        <div className="text-sm">
                          <p>Expected: {evaluation.spaceComplexity.expected}</p>
                          <p>Actual: {evaluation.spaceComplexity.actual}</p>
                          <p className={`text-sm ${evaluation.spaceComplexity.meetsExpectation ? 'text-green-500' : 'text-red-500'}`}>
                            {evaluation.spaceComplexity.meetsExpectation ? '✓ Meets expectation' : '✗ Does not meet expectation'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Quality Assessment */}
                  {evaluation.codeQuality && (
                    <div className="mt-3 space-y-2">
                      <h5 className="text-sm font-medium">Code Quality Assessment:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Readability</p>
                          <p className="text-sm">{evaluation.codeQuality.readability}</p>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Efficiency</p>
                          <p className="text-sm">{evaluation.codeQuality.efficiency}</p>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Best Practices</p>
                          <p className="text-sm">{evaluation.codeQuality.bestPractices}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edge Cases Assessment */}
                  {evaluation.edgeCases && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium">Edge Cases:</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {evaluation.edgeCases}
                      </p>
                    </div>
                  )}

                  {/* Hint for incorrect solutions */}
                  {!evaluation.isCorrect && evaluation.hint && (
                    <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Hint</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {evaluation.hint}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {output && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Test Results:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {output.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      result.passed
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        Test Case {index + 1}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Input:</span> {result.input}
                      </p>
                      <p>
                        <span className="font-medium">Expected:</span>{' '}
                        {result.expected}
                      </p>
                      <p>
                        <span className="font-medium">Output:</span>{' '}
                        {result.output || 'No output'}
                      </p>
                      {result.explanation && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {result.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor; 