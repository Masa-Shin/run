import {spawn} from 'child_process';
import {useApp} from 'ink';
import {useState} from 'react';

/** Platform-specific npm command names */
const NPM_COMMAND = {
  WIN32: 'npm.cmd',
  DEFAULT: 'npm',
} as const;

/**
 * Custom hook for executing npm scripts
 * Handles secure script execution and process management
 */
export function useScriptExecution() {
  const [isExecuted, setIsExecuted] = useState(false);
  const {exit} = useApp();

  const executeScript = (scriptName: string) => {
    console.log(`\nExecuting: npm run ${scriptName}\n`);

    // Secure process execution without shell
    const npmCommand =
      process.platform === 'win32' ? NPM_COMMAND.WIN32 : NPM_COMMAND.DEFAULT;
    const child = spawn(npmCommand, ['run', scriptName], {
      stdio: 'inherit',
    });

    setIsExecuted(true);

    child.on('exit', (code: number | null) => {
      if (code !== 0) {
        console.error(`\nScript exited with code ${code}`);
      }
      exit();
    });
    child.on('error', (err: Error) => {
      console.error(`Failed to execute script: ${err.message}`);
      exit();
    });
  };

  return {executeScript, isExecuted};
}
