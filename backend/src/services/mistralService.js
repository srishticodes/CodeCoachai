import axios from 'axios';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import { createError } from '../utils/error.js';
import { join } from 'path';

// Ensure environment variables are loaded
dotenv.config();

// Available models for different tasks
const AVAILABLE_MODELS = {
  'mistralai/Mistral-7B-v0.1': {
    description: 'General purpose model, good for coding and explanations',
    maxTokens: 2048,
    temperature: 0.7,
    status: 'verified'
  },
  'codellama/CodeLlama-7b-hf': {
    description: 'Specialized for code generation and understanding',
    maxTokens: 2048,
    temperature: 0.2,
    status: 'verified'
  },
  'bigcode/starcoder': {
    description: 'Specialized for code generation',
    maxTokens: 2048,
    temperature: 0.2,
    status: 'verified'
  },
  'deepseek-ai/deepseek-coder-1.3b-base': {
    description: 'Good for coding and detailed explanations',
    maxTokens: 2048,
    temperature: 0.3,
    status: 'verified'
  }
};

// Initialize Hugging Face client
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'mistralai/Mistral-7B-v0.1';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// Log API key status on service initialization
console.log('\nHugging Face Service Initialization:');
console.log('API Key exists:', !!HF_API_KEY);
console.log('API Key length:', HF_API_KEY?.length || 0);
console.log('API Key first 4 chars:', HF_API_KEY?.substring(0, 4) || 'none');
console.log('Selected Model:', HF_MODEL);
console.log('Model Description:', AVAILABLE_MODELS[HF_MODEL]?.description || 'Unknown');
console.log('API URL:', HF_API_URL);
console.log('Current working directory:', process.cwd());
console.log('Environment file location:', join(process.cwd(), '.env'));

// Helper function to get model parameters
const getModelParameters = (modelName, options = {}) => {
  const modelConfig = AVAILABLE_MODELS[modelName];
  if (!modelConfig) {
    console.error(`Model ${modelName} not found in available models. Using default model.`);
    return {
      max_new_tokens: 2048,
      temperature: 0.7,
      top_p: 0.95,
      return_full_text: false,
      ...options
    };
  }
  return {
    max_new_tokens: options.max_tokens || modelConfig.maxTokens,
    temperature: options.temperature || modelConfig.temperature,
    top_p: 0.95,
    return_full_text: false,
    ...options
  };
};

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

// Helper function to make Hugging Face API requests
const makeHFRequest = async (prompt, options = {}) => {
  if (!HF_API_KEY) {
    console.error('Hugging Face API key is missing');
    throw createError(500, 'Hugging Face API key is not configured');
  }

  // Validate model
  if (!AVAILABLE_MODELS[HF_MODEL]) {
    console.error(`Invalid model: ${HF_MODEL}`);
    console.log('Available models:');
    Object.entries(AVAILABLE_MODELS).forEach(([model, config]) => {
      console.log(`- ${model}: ${config.description} (${config.status})`);
    });
    throw createError(400, `Invalid model: ${HF_MODEL}. Please choose from the available models.`);
  }

  const modelParams = getModelParameters(HF_MODEL, options);
  const payload = {
    inputs: prompt,
    parameters: modelParams
  };

  console.log('Making Hugging Face API request:', {
    model: HF_MODEL,
    promptLength: prompt.length,
    temperature: modelParams.temperature,
    maxTokens: modelParams.max_new_tokens,
    modelDescription: AVAILABLE_MODELS[HF_MODEL]?.description
  });

  try {
    const response = await axios.post(
      HF_API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for larger responses
      }
    );

    console.log('Hugging Face API response received:', {
      status: response.status,
      responseLength: response.data?.length || 0,
      model: HF_MODEL
    });

    return response;
  } catch (error) {
    console.error('Hugging Face API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      model: HF_MODEL,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: {
          ...error.config?.headers,
          Authorization: error.config?.headers?.Authorization ? '[REDACTED]' : undefined
        }
      }
    });

    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw createError(401, 'Invalid Hugging Face API key. Please check your API key configuration.');
    } else if (error.response?.status === 404) {
      console.error('Available models:');
      Object.entries(AVAILABLE_MODELS).forEach(([model, config]) => {
        console.log(`- ${model}: ${config.description} (${config.status})`);
      });
      throw createError(404, `Model ${HF_MODEL} not found. Please choose from the available models.`);
    } else if (error.response?.status === 429) {
      throw createError(429, 'Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 503) {
      throw createError(503, `Model ${HF_MODEL} is currently loading. Please try again in a few minutes.`);
    } else {
      throw createError(500, `Hugging Face API request failed: ${error.message}`);
    }
  }
};

// Generate a new algorithmic question
export const generateQuestion = async (difficulty, language, category) => {
  try {
    const prompt = `<s>[INST] Generate a ${difficulty} level algorithmic coding question for ${language} programming language in the ${category} category. 

Requirements:
- Create a realistic interview-style problem
- Include 3-5 test cases with clear input/output examples
- Provide a working solution with explanation
- Add 2-3 progressive hints
- Include time and space complexity analysis

The response must be a valid JSON object following this exact structure:
${JSON.stringify(questionSchema, null, 2)} [/INST]</s>`;

    const response = await makeHFRequest(prompt, {
      max_tokens: 2048,
      temperature: 0.7
    });

    let questionData;
    try {
      // Extract JSON from the response text
      const jsonMatch = response.data[0].generated_text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      questionData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw response:', response.data[0].generated_text);
      throw createError(500, 'Invalid JSON response from AI service');
    }
    
    // Create and save the question
    const question = new Question({
      ...questionData,
      difficulty,
      language,
      category,
      createdBy: 'huggingface-ai'
    });

    await question.save();
    console.log('Question generated and saved:', question._id);
    return question;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw createError(500, `Failed to generate question: ${error.message}`);
  }
};

// Evaluate user's code solution
export const evaluateSolution = async (code, language, questionId) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const prompt = `<s>[INST] Evaluate this ${language} code solution for the following problem:

Problem: ${question.description}

User's Code:
\`\`\`${language}
${code}
\`\`\`

Expected Solution:
\`\`\`${language}
${question.solution.code}
\`\`\`

Test Cases:
${question.testCases.map((tc, i) => `Test ${i + 1}: Input: ${tc.input}, Expected: ${tc.expectedOutput}`).join('\n')}

Provide evaluation in JSON format with these exact fields:
{
  "isCorrect": boolean,
  "feedback": "detailed feedback string",
  "hints": ["array", "of", "hint", "strings"],
  "solution": "explanation of the correct approach"
} [/INST]</s>`;

    const response = await makeHFRequest(prompt, {
      max_tokens: 1024,
      temperature: 0.3
    });

    let evaluation;
    try {
      // Extract JSON from the response text
      const jsonMatch = response.data[0].generated_text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      evaluation = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw response:', response.data[0].generated_text);
      throw createError(500, 'Invalid JSON response from AI service');
    }

    return {
      ...evaluation,
      questionId,
      language
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw createError(500, `Failed to evaluate solution: ${error.message}`);
  }
};

// Generate a hint for a specific question
export const generateHint = async (questionId, hintLevel) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const prompt = `<s>[INST] Generate a progressive hint (level ${hintLevel}) for this coding problem:

Problem: ${question.description}

Previous hints given: ${question.hints.slice(0, hintLevel - 1).map(h => h.text || h).join(', ') || 'None'}

Provide a hint that:
- Guides the user without giving away the complete solution
- Is appropriate for hint level ${hintLevel} (where 1 is gentle nudge, higher levels are more specific)
- Helps them think about the right approach or algorithm

Respond with just the hint text, no additional formatting. [/INST]</s>`;

    const response = await makeHFRequest(prompt, {
      max_tokens: 256,
      temperature: 0.7
    });

    return response.data[0].generated_text.trim();
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw createError(500, `Failed to generate hint: ${error.message}`);
  }
};

// Generate solution explanation
export const generateSolutionExplanation = async (questionId) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw createError(404, 'Question not found');
    }

    const prompt = `<s>[INST] Explain the solution for this coding problem in detail:

Problem: ${question.description}

Solution Code:
\`\`\`${question.language}
${question.solution.code}
\`\`\`

Provide a comprehensive explanation that covers:
1. The approach and algorithm used
2. Step-by-step breakdown of the solution
3. Time and space complexity analysis
4. Key insights or patterns
5. Alternative approaches if applicable

Make it educational and easy to understand. [/INST]</s>`;

    const response = await makeHFRequest(prompt, {
      max_tokens: 1024,
      temperature: 0.7
    });

    return response.data[0].generated_text;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw createError(500, `Failed to generate solution explanation: ${error.message}`);
  }
};
