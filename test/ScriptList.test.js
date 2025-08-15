import test from 'ava';
import React from 'react';
import {render} from 'ink-testing-library';
import ScriptList from '../dist/components/ScriptList.js';

// Mock scripts
const mockScripts = [
  {name: 'build', command: 'tsc'},
  {name: 'test', command: 'ava'},
  {name: 'lint', command: 'eslint'},
];

const mockHookScripts = [
  {name: 'prebuild', command: 'echo "prebuild"'},
  {name: 'posttest', command: 'echo "posttest"'},
  {name: 'prepare', command: 'npm run build'},
];

// Test rendering
test('renders script list', t => {
  const {lastFrame} = render(
    React.createElement(ScriptList, {
      scripts: mockScripts,
      selectedIndex: 0,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );

  const frame = lastFrame();
  t.truthy(frame);
  t.regex(frame, /build/);
  t.regex(frame, /test/);
  t.regex(frame, /lint/);
});

// Test empty state
test('shows no scripts message when list is empty', t => {
  const {lastFrame} = render(
    React.createElement(ScriptList, {
      scripts: [],
      selectedIndex: 0,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: 'xyz',
    })
  );

  t.regex(lastFrame(), /No scripts matching "xyz"/);
});

// Test selection indicator
test('shows selection indicator for selected script', t => {
  const {lastFrame} = render(
    React.createElement(ScriptList, {
      scripts: mockScripts,
      selectedIndex: 1,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );

  const frame = lastFrame();
  // The selected script (test) should have the arrow indicator
  t.regex(frame, /▶.*test/);
});

// Test hook script indicator
test('shows hook indicator for hook scripts', t => {
  const {lastFrame} = render(
    React.createElement(ScriptList, {
      scripts: mockHookScripts,
      selectedIndex: 0,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );

  const frame = lastFrame();
  // Hook scripts should have the (hook) indicator
  t.regex(frame, /prebuild.*\(hook\)/);
  t.regex(frame, /posttest.*\(hook\)/);
  t.regex(frame, /prepare.*\(hook\)/);
});

// Test keyboard navigation (without actual key simulation)
test('renders with different selected indices', t => {
  // Test with first item selected
  const {lastFrame: frame1} = render(
    React.createElement(ScriptList, {
      scripts: mockScripts,
      selectedIndex: 0,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );
  t.regex(frame1(), /▶.*build/);

  // Test with second item selected
  const {lastFrame: frame2} = render(
    React.createElement(ScriptList, {
      scripts: mockScripts,
      selectedIndex: 1,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );
  t.regex(frame2(), /▶.*test/);

  // Test with last item selected
  const {lastFrame: frame3} = render(
    React.createElement(ScriptList, {
      scripts: mockScripts,
      selectedIndex: 2,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );
  t.regex(frame3(), /▶.*lint/);
});

// Test command display
test('displays script commands', t => {
  const {lastFrame} = render(
    React.createElement(ScriptList, {
      scripts: mockScripts,
      selectedIndex: 0,
      onSelectionChange: () => {},
      onExecuteScript: () => {},
      searchQuery: '',
    })
  );

  const frame = lastFrame();
  t.regex(frame, /build.*-.*tsc/);
  t.regex(frame, /test.*-.*ava/);
  t.regex(frame, /lint.*-.*eslint/);
});
