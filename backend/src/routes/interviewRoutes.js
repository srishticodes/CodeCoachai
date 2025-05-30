import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateQuestionHandler,
  getQuestionsHandler,
  submitSolutionHandler,
  getHintHandler,
  getSolutionHandler,
  getUserProgressHandler,
  getTotalQuestionsHandler
} from '../controllers/interviewController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Question management
router.post('/questions/generate', generateQuestionHandler);
router.get('/questions', getQuestionsHandler);

// Solution submission and evaluation
router.post('/solutions/submit', submitSolutionHandler);

// Hints and solutions
router.get('/questions/:questionId/hint', getHintHandler);
router.get('/questions/:questionId/solution', getSolutionHandler);

// User progress
router.get('/progress', getUserProgressHandler);

// Get total questions count
router.get('/questions/total', getTotalQuestionsHandler);

export default router; 