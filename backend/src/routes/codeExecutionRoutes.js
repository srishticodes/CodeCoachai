import express from 'express';
import { executeCodeHandler, getLanguageTemplateHandler } from '../controllers/codeExecutionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Execute code with test cases
router.post('/execute/test', executeCodeHandler);

// Get code template for a language
router.get('/templates/:language', getLanguageTemplateHandler);

export default router; 