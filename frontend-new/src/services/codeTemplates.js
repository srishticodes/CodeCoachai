// Language-specific code templates
export const languageTemplates = {
  javascript: 'function solution(input) {\n  // Write your code here\n  \n}',
  python: 'def solution(input):\n    # Write your code here\n    pass',
  java: 'public class Solution {\n    public static void solution(String input) {\n        // Write your code here\n    }\n}',
  cpp: '#include <iostream>\n\nvoid solution(std::string input) {\n    // Write your code here\n}\n\nint main() {\n    return 0;\n}'
};

// Get template for a specific language
export const getLanguageTemplate = (language) => {
  const template = languageTemplates[language.toLowerCase()];
  if (!template) {
    throw new Error('Unsupported programming language');
  }
  return template;
}; 