import { createError } from '../utils/error.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

// Language-specific code templates
const languageTemplates = {
  javascript: 'function solution(input) {\n  // Write your code here\n  \n}',
  python: 'def solution(input):\n    # Write your code here\n    pass',
  java: 'public class Solution {\n    public static void solution(String input) {\n        // Write your code here\n    }\n}',
  cpp: '#include <iostream>\n\nvoid solution(std::string input) {\n    // Write your code here\n}\n\nint main() {\n    return 0;\n}'
};

// Language-specific execution configurations
const languageConfigs = {
  javascript: {
    extension: '.js',
    command: (filePath) => `node ${filePath}`,
    wrapCode: (code) => `
      try {
        const input = process.argv[2];
        const result = solution(input);
        console.log(JSON.stringify(result));
      } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
      }
      ${code}
    `
  },
  python: {
    extension: '.py',
    command: (filePath) => `python ${filePath}`,
    wrapCode: (code) => `
      import sys
      import json
      try:
          input_data = sys.argv[1]
          result = solution(input_data)
          print(json.dumps(result))
      except Exception as e:
          print(json.dumps({"error": str(e)}))
      ${code}
    `
  },
  java: {
    extension: '.java',
    command: (filePath) => `java ${filePath.replace('.java', '')}`,
    wrapCode: (code) => `
      import java.util.*;
      public class Solution {
          ${code}
          public static void main(String[] args) {
              try {
                  String input = args[0];
                  Object result = solution(input);
                  System.out.println(new com.google.gson.Gson().toJson(result));
              } catch (Exception e) {
                  System.out.println(new com.google.gson.Gson().toJson(Map.of("error", e.getMessage())));
              }
          }
      }
    `
  },
  cpp: {
    extension: '.cpp',
    command: (filePath) => {
      const outputPath = filePath.replace('.cpp', '');
      return `g++ ${filePath} -o ${outputPath} && ${outputPath}`;
    },
    wrapCode: (code) => `
      #include <iostream>
      #include <string>
      #include <nlohmann/json.hpp>
      using json = nlohmann::json;
      ${code}
      int main(int argc, char* argv[]) {
          try {
              std::string input = argv[1];
              auto result = solution(input);
              std::cout << json(result).dump() << std::endl;
          } catch (const std::exception& e) {
              std::cout << json({{"error", e.what()}}).dump() << std::endl;
          }
          return 0;
      }
    `
  }
};

// Get template for a specific language
export const getLanguageTemplate = (language) => {
  const template = languageTemplates[language.toLowerCase()];
  if (!template) {
    throw createError(400, 'Unsupported programming language');
  }
  return template;
};

// Execute code with test cases
export const executeCode = async (code, language, testCases) => {
  const config = languageConfigs[language.toLowerCase()];
  if (!config) {
    throw createError(400, 'Unsupported programming language');
  }

  const results = [];
  const tempDir = tmpdir();
  const fileName = `${uuidv4()}${config.extension}`;
  const filePath = join(tempDir, fileName);

  try {
    // Write the wrapped code to a temporary file
    const wrappedCode = config.wrapCode(code);
    await writeFile(filePath, wrappedCode);

    // Execute each test case
    for (const testCase of testCases) {
      try {
        const { stdout, stderr } = await execAsync(
          config.command(filePath),
          {
            timeout: 5000, // 5 second timeout
            maxBuffer: 1024 * 1024, // 1MB buffer
            env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=128' } // Limit memory usage
          }
        );

        if (stderr) {
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: null,
            passed: false,
            error: stderr
          });
          continue;
        }

        let actualOutput;
        try {
          actualOutput = JSON.parse(stdout.trim());
          if (actualOutput.error) {
            throw new Error(actualOutput.error);
          }
        } catch (parseError) {
          throw new Error(`Invalid output format: ${stdout.trim()}`);
        }

        // Compare actual output with expected output
        const passed = JSON.stringify(actualOutput) === JSON.stringify(testCase.expectedOutput);
        
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          passed,
          error: passed ? null : 'Output does not match expected result'
        });

      } catch (execError) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          error: execError.message
        });
      }
    }

    return results;
  } catch (error) {
    throw createError(500, `Code execution failed: ${error.message}`);
  } finally {
    // Clean up temporary files
    try {
      await unlink(filePath);
      if (language === 'cpp') {
        await unlink(filePath.replace('.cpp', ''));
      }
    } catch (cleanupError) {
      console.error('Failed to clean up temporary files:', cleanupError);
    }
  }
}; 