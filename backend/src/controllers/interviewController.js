import { createError } from '../utils/error.js';
import { generateQuestion, evaluateSolution, generateHint, generateSolutionExplanation } from '../services/mistralService.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';

// Generate a new question
export const generateQuestionHandler = async (req, res, next) => {
  try {
    const { difficulty, language, category } = req.body;

    if (!difficulty || !language || !category) {
      return next(createError(400, 'Missing required fields: difficulty, language, and category'));
    }

    const question = await generateQuestion(difficulty, language, category);
    res.status(201).json({ question });
  } catch (error) {
    next(error);
  }
};

// Get questions by filters
export const getQuestionsHandler = async (req, res, next) => {
  try {
    const { difficulty, language, category, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (difficulty) query.difficulty = difficulty;
    if (language) query.language = language;
    if (category) query.category = category;

    const questions = await Question.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-solution -hints'); // Don't send solution and hints initially

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// Submit solution for evaluation
export const submitSolutionHandler = async (req, res, next) => {
  try {
    const { questionId, code, language } = req.body;
    const userId = req.user.id; // Assuming auth middleware sets req.user

    if (!questionId || !code || !language) {
      return next(createError(400, 'Missing required fields: questionId, code, and language'));
    }

    // Evaluate the solution
    const evaluation = await evaluateSolution(code, language, questionId);

    // Update user progress
    let userProgress = await UserProgress.findOne({ userId, questionId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId, questionId });
    }

    // Add attempt
    userProgress.attempts.push({
      code,
      language,
      testResults: evaluation.testResults || [],
      aiFeedback: {
        feedback: evaluation.feedback,
        hints: evaluation.hints || [],
        solution: evaluation.solution
      }
    });

    // Update status
    if (evaluation.isCorrect) {
      userProgress.status = 'solved';
      userProgress.solvedAt = new Date();
    } else {
      userProgress.status = 'attempted';
    }

    userProgress.lastAttemptAt = new Date();
    await userProgress.save();

    res.json({
      evaluation,
      progress: {
        status: userProgress.status,
        attempts: userProgress.attempts.length,
        solvedAt: userProgress.solvedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get hint for a question
export const getHintHandler = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const userProgress = await UserProgress.findOne({ userId, questionId });
    if (!userProgress) {
      return next(createError(404, 'Question progress not found'));
    }

    const hintLevel = userProgress.hintsUsed.length + 1;
    const hint = await generateHint(questionId, hintLevel);

    // Record hint usage
    userProgress.hintsUsed.push({
      hintId: hintLevel,
      usedAt: new Date()
    });
    await userProgress.save();

    res.json({ hint, hintLevel });
  } catch (error) {
    next(error);
  }
};

// Get solution explanation
export const getSolutionHandler = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const userProgress = await UserProgress.findOne({ userId, questionId });
    if (!userProgress) {
      return next(createError(404, 'Question progress not found'));
    }

    const explanation = await generateSolutionExplanation(questionId);

    // Record solution view
    userProgress.solutionViewed = true;
    userProgress.solutionViewedAt = new Date();
    userProgress.status = 'gave_up';
    await userProgress.save();

    res.json({ explanation });
  } catch (error) {
    next(error);
  }
};

// Get user's progress
export const getUserProgressHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const progress = await UserProgress.find(query)
      .populate('questionId', 'title difficulty category')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-lastAttemptAt');

    const total = await UserProgress.countDocuments(query);

    res.json({
      progress,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
}; 