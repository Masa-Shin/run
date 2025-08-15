import React from 'react';
import {Box, Text, useInput} from 'ink';
import {isHookScript, type Script} from '../utils/index.js';

type ScriptListProps = {
  /** All scripts or filtered scripts to display */
  scripts: Script[];
  /** Currently selected script index (ignored in non-interactive mode) */
  selectedIndex: number;
  /** Callback when selection changes (ignored in non-interactive mode) */
  onSelectionChange: (index: number) => void;
  /** Callback when a script is selected for execution (ignored in non-interactive mode) */
  onExecuteScript: (scriptName: string) => void;
  /** Trimmed search query for "no results" message */
  searchQuery: string;
};

/**
 * Script list component for displaying and selecting npm scripts
 * Handles both interactive (with keyboard navigation) and non-interactive modes
 */
export default function ScriptList({
  scripts,
  selectedIndex,
  onSelectionChange,
  onExecuteScript,
  searchQuery,
}: ScriptListProps) {
  useInput(
    (_input, key) => {
      if (scripts.length === 0) return;

      if (key.upArrow) {
        onSelectionChange(
          selectedIndex > 0 ? selectedIndex - 1 : scripts.length - 1
        );
      }
      if (key.downArrow) {
        onSelectionChange(
          selectedIndex < scripts.length - 1 ? selectedIndex + 1 : 0
        );
      }

      if (key.return && scripts[selectedIndex]) {
        onExecuteScript(scripts[selectedIndex].name);
      }
    },
    {isActive: scripts.length > 0}
  );

  if (scripts.length === 0) {
    return (
      <Box>
        <Text dimColor>No scripts matching &quot;{searchQuery}&quot;</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {scripts.map((script, index) => (
        <Box key={script.name}>
          <Text color={selectedIndex === index ? 'green' : 'white'}>
            {selectedIndex === index ? '▶ ' : '  '}
            <Text bold={selectedIndex === index}>{script.name}</Text>
            {isHookScript(script.name) && <Text color="yellow"> (hook)</Text>}
            <Text dimColor> - {script.command}</Text>
          </Text>
        </Box>
      ))}
    </Box>
  );
}
