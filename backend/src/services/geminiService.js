import { GoogleGenerativeAI } from '@google/generative-ai';
import Question from '../models/Question.js';
import { createError } from '../utils/error.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
console.log('GeminiService: Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('GeminiService: Error loading .env:', result.error);
} else {
  console.log('GeminiService: .env loaded successfully');
}

// Initialize Gemini AI with error handling
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GeminiService: GEMINI_API_KEY is not set in environment variables');
    console.log('GeminiService: Current environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      API_KEY_EXISTS: !!process.env.GEMINI_API_KEY,
      ENV_PATH: envPath,
      ENV_FILE_EXISTS: existsSync(envPath)
    });
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('GeminiService: Successfully initialized Gemini AI');
  }
} catch (error) {
  console.error('GeminiService: Error initializing Gemini AI:', error);
}

// Question schema for structured output
const questionSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    testCases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          input: { type: "string" },
          expectedOutput: { type: "string" },
          explanation: { type: "string" }
        }
      }
    },
    solution: {
      type: "object",
      properties: {
        code: { type: "string" },
        explanation: { type: "string" }
      }
    },
    hints: {
      type: "array",
      items: { type: "string" }
    },
    metadata: {
      type: "object",
      properties: {
        timeComplexity: { type: "string" },
        spaceComplexity: { type: "string" },
        tags: {
          type: "array",
          items: { type: "string" }
        }
      }
    }
  }
};

// Evaluation schema for structured output
const evaluationSchema = {
  type: "object",
  properties: {
    isCorrect: { type: "boolean" },
    feedback: { type: "string" },
    hints: {
      type: "array",
      items: { type: "string" }
    },
    solution: { type: "string" }
  }
};

// Generate a new algorithmic question
export const generateQuestion = async (difficulty, language, category) => {
  try {
    if (!genAI) {
      throw createError(500, 'Gemini AI service is not properly initialized. Please check your API key configuration.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `Generate a ${difficulty} level algorithmic coding question for ${language} programming language in the ${category} category. 
    Return the response in the following JSON format:
    {
      "title": "Question title",
      "description": "Detailed problem description",
      "testCases": [
        {
          "input": "Sample input",
          "expectedOutput": "Expected output",
          "explanation": "Explanation of the test case"
        }
      ],
      "solution": {
        "code": "Solution code in ${language}",
        "explanation": "Detailed explanation of the solution"
      },
      "hints": [
        {
          "text": "First hint about the approach",
          "order": 1
        },
        {
          "text": "Second hint about implementation",
          "order": 2
        },
        {
          "text": "Third hint about optimization",
          "order": 3
        }
      ],
      "metadata": {
        "timeComplexity": "O(n) or similar",
        "spaceComplexity": "O(1) or similar",
        "tags": ["array", "sorting", etc]
      }
    }
    
    Important: 
    1. Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text
    2. Each hint must be an object with "text" and "order" fields
    3. The "order" field should be a number indicating the hint's sequence (1, 2, 3, etc.)
    4. Make sure all JSON fields use double quotes
    5. DO NOT wrap the response in code blocks or markdown formatting`;

    const response = await model.generateContent({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const result = await response.response;
    let responseText = result.text().trim();
    
    // Clean up the response text by removing markdown code blocks if present
    responseText = responseText.replace(/^```json\s*|\s*```$/g, '').trim();
    
    // Try to parse the response as JSON
    let questionData;
    try {
      questionData = JSON.parse(responseText);

      // Transform hints if they're not in the correct format
      if (Array.isArray(questionData.hints)) {
        questionData.hints = questionData.hints.map((hint, index) => {
          if (typeof hint === 'string') {
            return {
              text: hint,
              order: index + 1
            };
          }
          return hint;
        });
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response. Raw response:', responseText);
      console.error('Parse error:', parseError);
      throw createError(500, 'Failed to parse question data from AI response. The response was not valid JSON.');
    }
    
    // Create and save the question
    const question = new Question({
      ...questionData,
      difficulty,
      language,
      category
    });

    await question.save();
    return question;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw createError(500, `Failed to generate question: ${error.message}`);
  }
};

// Evaluate user's code solution
export const evaluateSolution = async (code, language, questionId) => {
  try {
    if (!genAI) {
      throw createError(500, 'Gemini AI service is not properly initialized. Please check your API key configuration.');
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `Evaluate this ${language} code solution for the following problem.
    Return the response in the following JSON format:
    {
      "isCorrect": true/false,
      "feedback": "Detailed feedback about the solution",
      "hints": [
        {
          "text": "First hint if needed",
          "order": 1
        }
      ],
      "solution": "Complete solution explanation if needed"
    }

    Problem: ${question.description}
    
    User's Code:
    ${code}
    
    Expected Solution:
    ${question.solution.code}

    Test Cases:
    ${JSON.stringify(question.testCases, null, 2)}

    Important Evaluation Rules:
    1. Set isCorrect to true ONLY if ALL of these conditions are met:
       - The code compiles/runs without syntax errors
       - The code produces the correct output for ALL test cases
       - The code follows the problem's requirements
       - The code's logic is sound and efficient
    2. If ANY of these conditions are not met, set isCorrect to false and explain why in the feedback
    3. Provide specific feedback about what's wrong if isCorrect is false
    4. Include hints only if the solution needs improvement
    5. Make sure all JSON fields use double quotes
    6. DO NOT wrap the response in code blocks or markdown formatting
    7. Return ONLY the JSON object, no additional text`;

    const response = await model.generateContent({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent evaluation
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const result = await response.response;
    let responseText = result.text().trim();
    
    // Clean up the response text by removing markdown code blocks if present
    responseText = responseText.replace(/^```json\s*|\s*```$/g, '').trim();
    
    // Try to parse the response as JSON
    let evaluation;
    try {
      evaluation = JSON.parse(responseText);

      // Validate required fields
      if (typeof evaluation.isCorrect !== 'boolean') {
        throw new Error('Evaluation response missing or invalid isCorrect field');
      }
      if (typeof evaluation.feedback !== 'string') {
        throw new Error('Evaluation response missing or invalid feedback field');
      }

      // Transform hints if they're not in the correct format
      if (Array.isArray(evaluation.hints)) {
        evaluation.hints = evaluation.hints.map((hint, index) => {
          if (typeof hint === 'string') {
            return {
              text: hint,
              order: index + 1
            };
          }
          return hint;
        });
      } else {
        evaluation.hints = [];
      }

      // Ensure solution field exists
      if (!evaluation.solution) {
        evaluation.solution = '';
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response. Raw response:', responseText);
      console.error('Parse error:', parseError);
      throw createError(500, 'Failed to parse evaluation data from AI response. The response was not valid JSON.');
    }

    return {
      ...evaluation,
      questionId,
      language
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw createError(500, `Failed to evaluate solution: ${error.message}`);
  }
};

// Generate a hint for a specific question
export const generateHint = async (questionId, hintLevel) => {
  try {
    if (!genAI) {
      throw createError(500, 'Gemini AI service is not properly initialized. Please check your API key configuration.');
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `Generate a hint for this problem at hint level ${hintLevel}.
    Return the response in the following JSON format:
    {
      "hint": {
        "text": "The hint text",
        "order": ${hintLevel}
      }
    }

    Problem: ${question.description}
    
    Current hint level: ${hintLevel}
    Previous hints: ${question.hints.slice(0, hintLevel).map(h => h.text).join(', ')}

    Important:
    1. Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text
    2. The hint should be progressive (more helpful than previous hints)
    3. Make sure all JSON fields use double quotes
    4. The hint should guide the user without giving away the solution
    5. DO NOT wrap the response in code blocks or markdown formatting`;

    const response = await model.generateContent({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 256, // Shorter for hints
      }
    });

    const result = await response.response;
    let responseText = result.text().trim();
    
    // Clean up the response text by removing markdown code blocks if present
    responseText = responseText.replace(/^```json\s*|\s*```$/g, '').trim();
    
    // Try to parse the response as JSON
    let hintData;
    try {
      hintData = JSON.parse(responseText);

      // Ensure the hint is in the correct format
      if (typeof hintData.hint === 'string') {
        hintData.hint = {
          text: hintData.hint,
          order: hintLevel
        };
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response. Raw response:', responseText);
      console.error('Parse error:', parseError);
      throw createError(500, 'Failed to parse hint data from AI response. The response was not valid JSON.');
    }

    // Update the question with the new hint
    if (!question.hints) {
      question.hints = [];
    }
    
    // Update or add the hint at the correct level
    const hintIndex = question.hints.findIndex(h => h.order === hintLevel);
    if (hintIndex >= 0) {
      question.hints[hintIndex] = hintData.hint;
    } else {
      question.hints.push(hintData.hint);
    }
    
    await question.save();
    return hintData.hint;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw createError(500, `Failed to generate hint: ${error.message}`);
  }
};

// Generate solution explanation
export const generateSolutionExplanation = async (questionId) => {
  try {
    console.log('Generating solution explanation for question:', questionId);
    
    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = `Explain the solution for this programming problem:

Title: ${question.title}
Description: ${question.description}
Solution Code: ${question.solution.code}

Please provide a clear explanation of how the solution works. Include:
1. A brief overview of the approach
2. Step-by-step explanation of the code
3. Time and space complexity analysis

Keep the explanation clear and focused on how the code solves the problem.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text().trim();

    // Return a simple solution structure
    const solution = {
      explanation: {
        overview: "Solution Approach",
        stepByStep: explanation,
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        codeExplanation: question.solution.code
      }
    };

    // Update the question with the solution
    await Question.findByIdAndUpdate(questionId, {
      'solution.explanation': JSON.stringify(solution.explanation)
    });

    return solution;
  } catch (error) {
    console.error('Error in generateSolutionExplanation:', error);
    // Return a basic solution if generation fails
    return {
      explanation: {
        overview: "Solution Approach",
        stepByStep: "Here's how the solution works:\n\n" + question.solution.code,
        complexity: {
          time: "O(n)",
          space: "O(1)"
        },
        codeExplanation: question.solution.code
      }
    };
  }
}; 