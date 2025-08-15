import React, {useState, useEffect, useMemo} from 'react';
import {Box, Text} from 'ink';
import SearchInput from './SearchInput.js';
import ScriptList from './ScriptList.js';
import {useScript} from '../hooks/useScript.js';
import {useScriptExecution} from '../hooks/useScriptExecution.js';
import {useAppInput} from '../hooks/useAppInput.js';
import {fuzzyMatch, isHookScript} from '../utils/index.js';

type AppProps = {
  initialShowHooks?: boolean;
};

/**
 * Main App component for the CLI tool
 * Handles script loading, filtering, and execution
 */
export default function App({initialShowHooks = false}: AppProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHookScripts, setShowHookScripts] = useState(initialShowHooks);

  const {scripts, isScriptsEmpty} = useScript();
  const {executeScript, isExecuted} = useScriptExecution();

  useAppInput({
    onPressTab: () => {
      setShowHookScripts(prev => !prev);
      setSelectedIndex(0);
    },
  });

  const filteredScripts = useMemo(
    () =>
      scripts.filter(script => {
        const matchesSearch =
          searchQuery === '' || fuzzyMatch(searchQuery, script.name);

        const shouldShow = showHookScripts || !isHookScript(script.name);

        return matchesSearch && shouldShow;
      }),
    [scripts, searchQuery, showHookScripts]
  );
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredScripts]);

  if (isScriptsEmpty || isExecuted) return null;

  return (
    <Box flexDirection="column">
      <Text dimColor>
        (Enter to run, Tab to {showHookScripts ? 'hide' : 'show'} hook scripts,
        Esc to exit)
      </Text>

      <Box marginTop={1}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Type to filter..."
        />
      </Box>

      <Box marginTop={1}>
        <ScriptList
          scripts={filteredScripts}
          selectedIndex={selectedIndex}
          onSelectionChange={setSelectedIndex}
          onExecuteScript={executeScript}
          searchQuery={searchQuery}
        />
      </Box>
    </Box>
  );
}
