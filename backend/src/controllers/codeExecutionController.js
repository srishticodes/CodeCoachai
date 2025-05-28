import { executeCode, getLanguageTemplate } from '../services/codeExecution.js';
import { createError } from '../utils/error.js';

// Execute code with test cases
export const executeCodeHandler = async (req, res, next) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return next(createError(400, 'Missing required fields'));
    }

    const results = await executeCode(code, language, testCases);
    res.json({ results });
  } catch (error) {
    next(createError(500, error.message));
  }
};

// Get language template
export const getLanguageTemplateHandler = async (req, res, next) => {
  try {
    const { language } = req.params;

    if (!language) {
      return next(createError(400, 'Language is required'));
    }

    const template = getLanguageTemplate(language);
    res.json({ template });
  } catch (error) {
    next(createError(400, error.message));
  }
}; 