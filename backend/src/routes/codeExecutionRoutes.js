import express from 'express';
import { executeCode, getQuestions, getQuestion } from '../services/codeExecutionService.js';

const router = express.Router();

// Get available questions for a language and difficulty
router.get('/questions/:language/:difficulty', async (req, res, next) => {
  try {
    const { language, difficulty } = req.params;
    const questions = await getQuestions(language, difficulty);
    res.json(questions);
  } catch (error) {
    next(error);
  }
});

// Get a specific question
router.get('/questions/:language/:difficulty/:questionId', async (req, res, next) => {
  try {
    const { language, difficulty, questionId } = req.params;
    const question = await getQuestion(language, parseInt(questionId), difficulty);
    res.json(question);
  } catch (error) {
    next(error);
  }
});

// Execute code for a specific question
router.post('/execute', async (req, res, next) => {
  try {
    const { code, language, questionId, difficulty } = req.body;
    
    if (!code || !language || !questionId || !difficulty) {
      return res.status(400).json({
        message: 'Missing required fields: code, language, questionId, and difficulty are required'
      });
    }

    const result = await executeCode(code, language, parseInt(questionId), difficulty);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 