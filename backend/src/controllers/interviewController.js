import { createError } from '../utils/error.js';
import { generateQuestion, evaluateSolution, generateHint, generateSolutionExplanation } from '../services/geminiService.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';

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
    const skip = (page - 1) * limit;
    const query = { isActive: true };

    if (difficulty) query.difficulty = difficulty;
    if (language) query.language = language;
    if (category) query.category = category;

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query).skip(skip).limit(limit).lean();

    res.json({ total, questions });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate question score
const calculateQuestionScore = (userProgress) => {
  // Base score is 100
  let score = 100;
  
  // Penalty for attempts (max 3 attempts before penalty)
  const attemptPenalty = Math.max(0, userProgress.attempts.length - 3) * 10;
  score -= attemptPenalty;
  
  // Penalty for hints used (each hint reduces score by 15)
  const hintPenalty = userProgress.hintsUsed.length * 15;
  score -= hintPenalty;
  
  // Penalty for viewing solution (reduces score by 30)
  if (userProgress.solutionViewed) {
    score -= 30;
  }
  
  // Ensure score doesn't go below 0
  return Math.max(0, Math.round(score));
};

// Submit solution for evaluation
export const submitSolutionHandler = async (req, res, next) => {
  try {
    console.log('Submit solution request:', {
      questionId: req.body.questionId,
      language: req.body.language,
      codeLength: req.body.code?.length,
      userId: req.user?.id
    });

    const { questionId, code, language } = req.body;
    const userId = req.user.id;

    if (!questionId || !code || !language) {
      console.log('Missing required fields:', { questionId, code: !!code, language });
      return next(createError(400, 'Missing required fields: questionId, code, and language'));
    }

    // Evaluate the solution
    console.log('Evaluating solution...');
    const evaluation = await evaluateSolution(code, language, questionId);
    console.log('Evaluation result:', {
      isCorrect: evaluation.isCorrect,
      feedbackLength: evaluation.feedback?.length,
      hintsCount: evaluation.hints?.length
    });

    // Transform hints to the correct format
    const transformedHints = Array.isArray(evaluation.hints) 
      ? evaluation.hints.map(hint => typeof hint === 'object' ? hint.text : hint)
      : [];

    // Update user progress
    console.log('Updating user progress...');
    let userProgress;
    let isNewlySolved = false;
    try {
      userProgress = await UserProgress.findOne({ userId, questionId });
      if (!userProgress) {
        console.log('Creating new user progress record');
        userProgress = new UserProgress({ userId, questionId });
      }

      // Check if this is a new solution (wasn't solved before)
      isNewlySolved = evaluation.isCorrect && userProgress.status !== 'solved';

      // Add attempt
      userProgress.attempts.push({
        code,
        language,
        testResults: evaluation.testResults || [],
        aiFeedback: {
          feedback: evaluation.feedback,
          hints: transformedHints,
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
      console.log('User progress updated successfully');

      // If this is a new solution, update user's profile stats
      if (isNewlySolved) {
        console.log('Updating user profile stats for new solution');
        
        // Calculate score for this question
        const questionScore = calculateQuestionScore(userProgress);
        console.log('Calculated question score:', questionScore, {
          attempts: userProgress.attempts.length,
          hintsUsed: userProgress.hintsUsed.length,
          solutionViewed: userProgress.solutionViewed
        });

        // Get current user to calculate new average
        const currentUser = await User.findById(userId);
        const currentTotalScore = currentUser.profile.completedQuestions.length * currentUser.profile.averageScore;
        const newTotalScore = currentTotalScore + questionScore;
        const newAverageScore = Math.round(newTotalScore / (currentUser.profile.completedQuestions.length + 1));

        // Update user profile with new question and average score
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $addToSet: { 'profile.completedQuestions': questionId },
            $set: { 'profile.averageScore': newAverageScore }
          },
          { new: true }
        );
        
        console.log('User profile stats updated:', {
          completedQuestions: user.profile.completedQuestions.length,
          averageScore: user.profile.averageScore,
          questionScore
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      if (dbError.code === 11000) {
        // Duplicate key error
        console.log('Duplicate key error, retrying with update...');
        userProgress = await UserProgress.findOneAndUpdate(
          { userId, questionId },
          {
            $push: {
              attempts: {
                code,
                language,
                testResults: evaluation.testResults || [],
                aiFeedback: {
                  feedback: evaluation.feedback,
                  hints: transformedHints,
                  solution: evaluation.solution
                }
              }
            },
            $set: {
              status: evaluation.isCorrect ? 'solved' : 'attempted',
              lastAttemptAt: new Date(),
              ...(evaluation.isCorrect && { solvedAt: new Date() })
            }
          },
          { new: true, upsert: true }
        );

        // If this is a new solution, update user's profile stats
        if (isNewlySolved) {
          console.log('Updating user profile stats for new solution after retry');
          
          // Calculate score for this question
          const questionScore = calculateQuestionScore(userProgress);
          console.log('Calculated question score after retry:', questionScore, {
            attempts: userProgress.attempts.length,
            hintsUsed: userProgress.hintsUsed.length,
            solutionViewed: userProgress.solutionViewed
          });

          // Get current user to calculate new average
          const currentUser = await User.findById(userId);
          const currentTotalScore = currentUser.profile.completedQuestions.length * currentUser.profile.averageScore;
          const newTotalScore = currentTotalScore + questionScore;
          const newAverageScore = Math.round(newTotalScore / (currentUser.profile.completedQuestions.length + 1));

          // Update user profile with new question and average score
          const user = await User.findByIdAndUpdate(
            userId,
            {
              $addToSet: { 'profile.completedQuestions': questionId },
              $set: { 'profile.averageScore': newAverageScore }
            },
            { new: true }
          );
          
          console.log('User profile stats updated after retry:', {
            completedQuestions: user.profile.completedQuestions.length,
            averageScore: user.profile.averageScore,
            questionScore
          });
        }
      } else {
        throw dbError;
      }
    }

    console.log('Sending response...');
    res.json({
      evaluation,
      progress: {
        status: userProgress.status,
        attempts: userProgress.attempts.length,
        solvedAt: userProgress.solvedAt
      }
    });
  } catch (error) {
    console.error('Submit solution error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    next(error);
  }
};

// Get hint for a question
export const getHintHandler = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    console.log('Getting hint for question:', { questionId, userId });

    // Create user progress if it doesn't exist
    let userProgress = await UserProgress.findOne({ userId, questionId });
    if (!userProgress) {
      console.log('Creating new user progress for hint request');
      userProgress = new UserProgress({ 
        userId, 
        questionId,
        status: 'attempted'
      });
    }

    const hintLevel = userProgress.hintsUsed.length + 1;
    console.log('Current hint level:', hintLevel);

    console.log('Generating hint...');
    const hintData = await generateHint(questionId, hintLevel);
    console.log('Generated hint data:', hintData);

    if (!hintData || !hintData.text) {
      console.error('Invalid hint data:', hintData);
      throw createError(500, 'Failed to generate valid hint');
    }

    // Record hint usage
    userProgress.hintsUsed.push({
      hintId: hintLevel,
      usedAt: new Date()
    });
    await userProgress.save();
    console.log('Hint usage recorded');

    // Return just the hint text as expected by the frontend
    const response = { hint: hintData.text };
    console.log('Sending hint response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error in getHintHandler:', error);
    next(error);
  }
};

// Get solution explanation
export const getSolutionHandler = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    console.log('Getting solution for question:', { questionId, userId });

    // Create user progress if it doesn't exist
    let userProgress = await UserProgress.findOne({ userId, questionId });
    if (!userProgress) {
      console.log('Creating new user progress for solution request');
      userProgress = new UserProgress({ 
        userId, 
        questionId,
        status: 'attempted'
      });
    }

    console.log('Generating solution explanation...');
    const explanationData = await generateSolutionExplanation(questionId);
    console.log('Generated explanation data:', explanationData);

    // Validate the explanation structure
    const requiredFields = ['overview', 'stepByStep', 'complexity', 'codeExplanation'];
    const missingFields = requiredFields.filter(field => !explanationData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields in solution:', missingFields);
      throw createError(500, `Solution is missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate complexity structure
    if (!explanationData.complexity || !explanationData.complexity.time || !explanationData.complexity.space) {
      console.error('Invalid complexity data:', explanationData.complexity);
      throw createError(500, 'Solution complexity analysis is incomplete');
    }

    console.log('Solution data validated successfully');

    // Record solution view
    userProgress.solutionViewed = true;
    userProgress.solutionViewedAt = new Date();
    userProgress.status = 'gave_up';
    await userProgress.save();
    console.log('Solution view recorded');

    // Return the structured explanation object
    const response = { explanation: explanationData };
    console.log('Sending solution response');
    res.json(response);
  } catch (error) {
    console.error('Error in getSolutionHandler:', error);
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

// Get total count of active questions
export const getTotalQuestionsHandler = async (req, res, next) => {
  try {
    const total = await Question.countDocuments({ isActive: true });
    res.json({ total });
  } catch (error) {
    next(error);
  }
}; 