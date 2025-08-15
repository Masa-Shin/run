import {useState, useEffect} from 'react';
import {useApp} from 'ink';
import fs from 'fs';
import path from 'path';
import {type Script} from '../utils/index.js';

const isValidScriptName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  if (name.length === 0 || name.length > 100) return false;

  return /^[a-zA-Z0-9-_:.]+$/.test(name);
};
/**
 * Extract scripts field from package.json safely
 * @param text - JSON string to parse
 */
const extractScripts = (text: string): Script[] => {
  const parsed = JSON.parse(text);

  if (!parsed || typeof parsed !== 'object' || !parsed.scripts) {
    throw new Error('No scripts found in package.json');
  }

  const scripts = parsed.scripts;

  if (typeof scripts !== 'object' || Array.isArray(scripts)) {
    throw new Error('Invalid scripts format in package.json');
  }

  // Only return string values from scripts
  const validScripts: Script[] = [];
  for (const [key, value] of Object.entries(scripts)) {
    if (isValidScriptName(key) && typeof value === 'string') {
      validScripts.push({
        name: key,
        command: value,
      });
    }
  }

  return validScripts;
};
/**
 * Custom hook for loading and managing npm scripts from package.json
 * @returns Object containing scripts, error state, and reload function
 */
export const useScript = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const {exit} = useApp();

  const loadPackageJson = async () => {
    try {
      // Read file
      const packagePath = path.resolve(process.cwd(), 'package.json');
      const packageContent = fs.readFileSync(packagePath, 'utf-8');
      const scripts = extractScripts(packageContent);

      if (scripts.length === 0) throw new Error('No npm scripts detected.');

      setScripts(scripts);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'unknown error';
      console.log(`Failed to load npm scripts: ${errorMessage}`);
      process.exitCode = 1;
      exit();
    }
  };

  useEffect(() => {
    loadPackageJson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    scripts,
    isScriptsEmpty: scripts.length === 0,
  };
};
