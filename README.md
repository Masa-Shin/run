# @masa-shin/run

An interactive CLI tool that allows you to search and execute npm scripts from package.json with fuzzy search functionality and keyboard navigation.

<img width="1570" height="374" alt="スクリーンショット 2025-08-16 23 34 30" src="https://github.com/user-attachments/assets/aaaf963f-9fda-4bc7-af80-374ba494854e" />

## Features

- **Interactive Interface**: Built with Ink (React for CLI) for a smooth experience
- **Fuzzy Search**: Quickly find scripts by typing partial names
- **Smart Hook Script Filtering**: Hides npm lifecycle hooks by default
  - Automatically hides scripts you rarely run manually (`preinstall`, `postinstall`, `prepare`, `version`, etc.)
  - Press `Tab` to toggle visibility of hook scripts

<img width="1570" height="508" alt="スクリーンショット 2025-08-16 23 35 20" src="https://github.com/user-attachments/assets/2425a61a-b298-40f4-aa65-d70801924c9f" />

## Installation

### Global installation

```bash
npm install --global @masa-shin/run
```

### Using npx (no installation required)

```bash
npx @masa-shin/run
```

## Usage

### Interactive Mode (TTY environments)

Simply run the command in any directory with a package.json:

```bash
# If installed globally
run

# Or using npx
npx @masa-shin/run
```

### Show Hook Scripts by Default

To show hook scripts from startup:

```bash
# Show hook scripts by default
run --show-hooks
# or short form
run -s
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development with watch mode
npm run dev

# Run tests
npm run test

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
```

## Requirements

- Node.js >= 16
- A package.json file with scripts in the current directory

## License

MIT
