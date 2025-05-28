import { getCodeFeedback, getCodeExplanation } from '../services/aiFeedback.js';
import { createError } from '../utils/error.js';

// Get code feedback
export const getFeedbackHandler = async (req, res, next) => {
  try {
    const { code, language, question, testResults } = req.body;

    if (!code || !language || !question || !testResults) {
      return next(createError(400, 'Missing required fields'));
    }

    const result = await getCodeFeedback(code, language, question, testResults);
    
    if (result.error) {
      return next(createError(500, result.error));
    }

    res.json({ feedback: result.feedback });
  } catch (error) {
    next(createError(500, error.message));
  }
};

// Get code explanation
export const getExplanationHandler = async (req, res, next) => {
  try {
    const { code, language, question } = req.body;

    if (!code || !language || !question) {
      return next(createError(400, 'Missing required fields'));
    }

    const result = await getCodeExplanation(code, language, question);
    
    if (result.error) {
      return next(createError(500, result.error));
    }

    res.json({ explanation: result.explanation });
  } catch (error) {
    next(createError(500, error.message));
  }
}; 