import { createError } from '../utils/error.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Register user
export const registerHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, 'Email already registered'));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUserHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
<<<<<<< HEAD
};

// Update user profile
export const updateProfileHandler = async (req, res, next) => {
  try {
    const { skillLevel, preferredLanguage } = req.body;
    const userId = req.user.id;

    // Validate input
    if (skillLevel && !['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
      return next(createError(400, 'Invalid skill level'));
    }
    if (preferredLanguage && !['javascript', 'python', 'java', 'cpp'].includes(preferredLanguage)) {
      return next(createError(400, 'Invalid preferred language'));
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.skillLevel': skillLevel,
          'profile.preferredLanguage': preferredLanguage
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
=======
>>>>>>> 82da84531dece80fe44a4b084f560ccb0ce34807
}; 