import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler } from './utils/error.js';

// Import routes
import codeExecutionRoutes from './routes/codeExecutionRoutes.js';
import aiFeedbackRoutes from './routes/aiFeedbackRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to database
connectDB();

// Routes
app.use('/api/code', codeExecutionRoutes);
app.use('/api/feedback', aiFeedbackRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 