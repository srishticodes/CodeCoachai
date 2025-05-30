import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  registerHandler,
  loginHandler,
<<<<<<< HEAD
  getCurrentUserHandler,
  updateProfileHandler
=======
  getCurrentUserHandler
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);

// Protected routes
router.get('/me', protect, getCurrentUserHandler);
<<<<<<< HEAD
router.put('/profile', protect, updateProfileHandler);
=======
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807

export default router; 