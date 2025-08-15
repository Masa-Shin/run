/**
 * Represents an npm script from package.json
 */
export type Script = {
  /** The name of the script */
  name: string;
  /** The command to execute */
  command: string;
};
/**
 * Additional npm lifecycle hook scripts (beyond pre/post hooks)
 * These are scripts that users rarely execute manually
 */
const ADDITIONAL_HOOK_SCRIPTS = new Set([
  'install',
  'prepare',
  'publish',
  'version',
  'dependencies',
  'shrinkwrap',
]);
/**
 * Check if a script is a hook script (pre/post or lifecycle scripts)
 * @param scriptName - The name of the script to check
 * @returns True if the script is a hook script
 */
export const isHookScript = (scriptName: string): boolean => {
  if (ADDITIONAL_HOOK_SCRIPTS.has(scriptName)) return true;

  // Check for pre/post hooks but ensure there's a script name after the prefix
  if (scriptName.startsWith('pre') && scriptName.length > 3) return true;
  if (scriptName.startsWith('post') && scriptName.length > 4) return true;

  return false;
};
