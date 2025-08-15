import test from 'ava';
import React from 'react';
import {render} from 'ink-testing-library';
import App from '../dist/components/App.js';

// Test component rendering
test('renders without crashing', t => {
  const {lastFrame} = render(React.createElement(App));
  t.truthy(lastFrame);
});
