import express from 'express';
import { getFeedbackHandler, getExplanationHandler } from '../controllers/aiFeedbackController.js';

const router = express.Router();

// Routes
router.post('/feedback', getFeedbackHandler);
router.post('/explanation', getExplanationHandler);

export default router; 