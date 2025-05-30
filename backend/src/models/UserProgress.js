import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'attempted', 'solved', 'gave_up'],
    default: 'not_started'
  },
  attempts: [{
    code: String,
    language: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    testResults: [{
      passed: Boolean,
      input: String,
      expectedOutput: String,
      actualOutput: String,
      error: String
    }],
    aiFeedback: {
      feedback: String,
      hints: [String],
      solution: String
    }
  }],
  lastAttemptAt: Date,
  solvedAt: Date,
  hintsUsed: [{
    hintId: Number,
    usedAt: Date
  }],
  solutionViewed: {
    type: Boolean,
    default: false
  },
  solutionViewedAt: Date
}, {
  timestamps: true
});

// Compound index for efficient querying
userProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, status: 1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress; 