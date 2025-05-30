import express from 'express';
<<<<<<< HEAD
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
=======
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { errorHandler } from './utils/error.js';
import passport from 'passport';
import session from 'express-session';
import { configureGoogleAuth } from './config/googleAuth.js';

<<<<<<< HEAD
// Import routes
import authRoutes from './routes/authRoutes.js';
import codeExecutionRoutes from './routes/codeExecutionRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env file from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Verify critical environment variables
console.log('\nEnvironment Variables Check:');
console.log('- .env file path:', envPath);
console.log('- .env file exists:', existsSync(envPath));
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('- GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('- GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
=======
// Load environment variables
dotenv.config();
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log environment status
console.log('\nEnvironment Status:');
console.log('Current working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('\nRequired Environment Variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('HF_API_KEY:', process.env.HF_API_KEY ? '✓ Set' : '✗ Missing');
console.log('HF_MODEL:', process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2 (default)');
console.log('PORT:', process.env.PORT || '5000 (default)');

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'HF_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('\nError: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  console.error('\nPlease set these variables in your .env file');
  process.exit(1);
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

<<<<<<< HEAD
// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google Auth
configureGoogleAuth();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeExecutionRoutes);
app.use('/api/interview', interviewRoutes);

// Add Google OAuth routes
app.get('/api/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/cloud-platform']
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: '/'
  })
);
=======
// Add request timing
app.use((req, res, next) => {
  req._startTime = Date.now();
  next();
});

// Routes
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import codeExecutionRoutes from './routes/codeExecutionRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/code', codeExecutionRoutes);
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

<<<<<<< HEAD
// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 
=======
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\nConnected to MongoDB');
    // Start server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('\nAPI Endpoints:');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
      console.log('- GET /api/auth/me');
      console.log('- POST /api/interview/questions/generate');
      console.log('- GET /api/interview/questions');
      console.log('- POST /api/interview/solutions/submit');
      console.log('- GET /api/interview/questions/:questionId/hint');
      console.log('- GET /api/interview/questions/:questionId/solution');
      console.log('- GET /api/interview/progress');
      console.log('- POST /api/code/execute');
      console.log('- GET /api/code/languages');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
