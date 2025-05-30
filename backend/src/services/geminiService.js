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

    Important:
    1. Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text
    2. Set isCorrect to true only if the solution is completely correct
    3. Provide specific feedback about what's wrong if isCorrect is false
    4. Include hints only if the solution needs improvement
    5. Make sure all JSON fields use double quotes
    6. DO NOT wrap the response in code blocks or markdown formatting`;

    const response = await model.generateContent({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent evaluation
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
    if (!genAI) {
      throw createError(500, 'Gemini AI service is not properly initialized. Please check your API key configuration.');
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const prompt = [
      'Explain the solution for this problem in detail.',
      'Return the response in the following JSON format:',
      '{',
      '  "explanation": {',
      '    "overview": "High-level explanation of the approach",',
      '    "stepByStep": "Detailed step-by-step explanation (use plain text, no markdown formatting)",',
      '    "complexity": {',
      '      "time": "Time complexity explanation",',
      '      "space": "Space complexity explanation"',
      '    },',
      '    "codeExplanation": "Line-by-line explanation of the solution code (use plain text, no markdown formatting, escape newlines with \\n)"',
      '  }',
      '}',
      '',
      'Problem: ' + question.description,
      '',
      'Solution Code:',
      question.solution.code,
      '',
      'Important:',
      '1. Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text',
      '2. Make sure all JSON fields use double quotes',
      '3. Provide a clear and comprehensive explanation',
      '4. Include both high-level and detailed explanations',
      '5. DO NOT use markdown formatting in any field (no **, #, ```, etc.)',
      '6. DO NOT wrap the response in code blocks or markdown formatting',
      '7. Use plain text for all explanations, including code explanations',
      '8. In codeExplanation, use \\n for newlines and escape any quotes with \\"',
      '9. Ensure all newlines in codeExplanation are properly escaped with \\n'
    ].join('\n');

    const response = await model.generateContent({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
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
    let explanationData;
    try {
      // First, try to fix any unescaped newlines in the codeExplanation
      const fixedResponseText = responseText.replace(
        /"codeExplanation":\s*"([^"]*?)(?<!\\)\n([^"]*?)"/g,
        (match, p1, p2) => `"codeExplanation": "${p1}\\n${p2}"`
      );

      explanationData = JSON.parse(fixedResponseText);

      // Clean up any markdown formatting in the explanation fields
      if (explanationData.explanation) {
        const cleanMarkdown = (text) => {
          if (typeof text !== 'string') return text;
          return text
            .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
            .replace(/\*(.*?)\*/g, '$1')      // Remove italic
            .replace(/`(.*?)`/g, '$1')        // Remove inline code
            .replace(/```[\s\S]*?```/g, '')   // Remove code blocks
            .replace(/#{1,6}\s/g, '')         // Remove headers
            .replace(/\n\s*[-*+]\s/g, '\n')   // Remove list markers
            .replace(/\n\s*\d+\.\s/g, '\n')   // Remove numbered lists
            .replace(/\\n/g, '\n')            // Convert escaped newlines to actual newlines
            .trim();
        };

        explanationData.explanation = {
          ...explanationData.explanation,
          overview: cleanMarkdown(explanationData.explanation.overview),
          stepByStep: cleanMarkdown(explanationData.explanation.stepByStep),
          codeExplanation: cleanMarkdown(explanationData.explanation.codeExplanation),
          complexity: {
            time: cleanMarkdown(explanationData.explanation.complexity?.time || ''),
            space: cleanMarkdown(explanationData.explanation.complexity?.space || '')
          }
        };

        // Update the question with the formatted explanation string
        const formattedExplanation = [
          'Overview:',
          explanationData.explanation.overview,
          '',
          'Step by Step:',
          explanationData.explanation.stepByStep,
          '',
          'Time Complexity:',
          explanationData.explanation.complexity.time,
          '',
          'Space Complexity:',
          explanationData.explanation.complexity.space,
          '',
          'Code Explanation:',
          explanationData.explanation.codeExplanation
        ].join('\n');

        question.solution.explanation = formattedExplanation;
        await question.save();
        
        // Return the structured explanation for the API response
        return explanationData.explanation;
      }

      // If the response is just a string, wrap it in the expected format
      if (typeof explanationData === 'string') {
        const formattedExplanation = explanationData;
        question.solution.explanation = formattedExplanation;
        await question.save();
        
        return {
          overview: explanationData,
          stepByStep: explanationData,
          complexity: {
            time: "As mentioned in the explanation",
            space: "As mentioned in the explanation"
          },
          codeExplanation: explanationData
        };
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response. Raw response:', responseText);
      console.error('Parse error:', parseError);
      throw createError(500, 'Failed to parse solution explanation from AI response. The response was not valid JSON.');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw createError(500, `Failed to generate solution explanation: ${error.message}`);
  }
}; 