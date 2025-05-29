import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  registerHandler,
  loginHandler,
  getCurrentUserHandler
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);

// Protected routes
router.get('/me', protect, getCurrentUserHandler);

export default router; 