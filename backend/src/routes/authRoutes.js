import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  registerHandler,
  loginHandler,
  getCurrentUserHandler,
  updateProfileHandler
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);

// Protected routes
router.get('/me', protect, getCurrentUserHandler);
router.put('/profile', protect, updateProfileHandler);

export default router; 