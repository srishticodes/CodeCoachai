import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty level is required']
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp'],
    required: [true, 'Programming language is required']
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    explanation: String
  }],
  solution: {
    code: String,
    explanation: String
  },
  hints: [{
    text: String,
    order: Number
  }],
  category: {
    type: String,
    enum: ['arrays', 'strings', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'other'],
    required: [true, 'Question category is required']
  },
  createdBy: {
    type: String,
    default: 'gemini-ai'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    timeComplexity: String,
    spaceComplexity: String,
    tags: [String]
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ difficulty: 1, language: 1, category: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question; 