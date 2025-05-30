import express from 'express';
<<<<<<< HEAD
import { executeCodeHandler, getLanguageTemplateHandler } from '../controllers/codeExecutionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Execute code with test cases
router.post('/execute/test', executeCodeHandler);

// Get code template for a language
router.get('/templates/:language', getLanguageTemplateHandler);
=======
import { protect } from '../middleware/auth.js';
import { executeCode } from '../services/codeExecution.js';
import { createError } from '../utils/error.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Execute code with test cases
router.post('/execute', async (req, res, next) => {
  try {
    const { code, language, testCases } = req.body;

    // Validate required fields
    if (!code || !language || !testCases) {
      return next(createError(400, 'Missing required fields: code, language, and testCases'));
    }

    // Validate test cases format
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return next(createError(400, 'testCases must be a non-empty array'));
    }

    // Validate each test case
    for (const testCase of testCases) {
      if (!testCase.input || testCase.expectedOutput === undefined) {
        return next(createError(400, 'Each test case must have input and expectedOutput'));
      }
    }

    // Execute the code
    const results = await executeCode(code, language, testCases);

    // Calculate summary
    const summary = {
      total: testCases.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      executionTime: Date.now() - req._startTime // Add execution time tracking
    };

    res.json({
      results,
      summary
    });
  } catch (error) {
    next(error);
  }
});
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807

// Get supported languages
router.get('/languages', (req, res) => {
  const supportedLanguages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      version: 'Node.js',
      extension: '.js',
      requirements: ['Node.js']
    },
    {
      id: 'python',
      name: 'Python',
      version: '3.x',
      extension: '.py',
      requirements: ['Python 3.x']
    },
    {
      id: 'java',
      name: 'Java',
      version: 'JDK 11+',
      extension: '.java',
      requirements: ['Java JDK 11+', 'Google Gson Library']
    },
    {
      id: 'cpp',
      name: 'C++',
      version: 'C++17',
      extension: '.cpp',
      requirements: ['G++ Compiler', 'nlohmann/json Library']
    }
  ];

  res.json({ languages: supportedLanguages });
});

export default router; 