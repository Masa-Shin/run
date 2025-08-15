#!/usr/bin/env node
/**
 * CLI entry point for the npm script runner tool
 *
 * This module sets up the command-line interface using meow for argument parsing
 * and Ink for rendering the React-based TUI. It handles TTY detection for
 * graceful fallback in non-interactive environments.
 */
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './components/App.js';

const cli = meow(
  `
  Usage
    $ run [options]

  Options
    --show-hooks, -s    Show hook scripts (pre*/post*) by default

  Examples
    $ run
    $ run --show-hooks
    $ run -s
`,
  {
    importMeta: import.meta,
    flags: {
      showHooks: {
        type: 'boolean',
        alias: 's',
        default: false,
      },
    },
  }
);

render(<App initialShowHooks={cli.flags.showHooks} />);
