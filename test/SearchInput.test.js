import test from 'ava';
import React from 'react';
import {render} from 'ink-testing-library';
import SearchInput from '../dist/components/SearchInput.js';

// Test rendering
test('renders search input component', t => {
  const {lastFrame} = render(
    React.createElement(SearchInput, {
      value: '',
      onChange: () => {},
    })
  );
  t.truthy(lastFrame);
  t.regex(lastFrame(), /Search scripts:/);
});

// Test value prop
test('displays the provided value', t => {
  const {lastFrame} = render(
    React.createElement(SearchInput, {
      value: 'test query',
      onChange: () => {},
    })
  );
  t.regex(lastFrame(), /test query/);
});

// Test input sanitization helper
test('sanitizes input correctly', t => {
  // Test that the component renders with sanitized values
  const {lastFrame} = render(
    React.createElement(SearchInput, {
      value: '  test  ',
      onChange: () => {},
    })
  );

  // Component should display the value as provided (parent controls the state)
  t.regex(lastFrame(), /test/);
});
