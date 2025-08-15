/**
 * Search and filtering utilities
 */

/**
 * Fuzzy match algorithm for filtering scripts
 * @param pattern - The search pattern
 * @param str - The string to match against
 * @returns True if the pattern matches the string
 */
export const fuzzyMatch = (pattern: string, str: string): boolean => {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();

  let patternIdx = 0;
  let strIdx = 0;

  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }

  return patternIdx === pattern.length;
};
