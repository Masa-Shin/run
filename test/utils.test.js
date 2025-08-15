import test from 'ava';
import {fuzzyMatch} from '../dist/utils/search.js';
import {isHookScript} from '../dist/utils/script.js';

// Search algorithm tests
test('fuzzyMatch - exact matches', t => {
  t.true(fuzzyMatch('build', 'build'));
  t.true(fuzzyMatch('test', 'test'));
  t.true(fuzzyMatch('start', 'start'));
  t.true(fuzzyMatch('', ''));
});

test('fuzzyMatch - case insensitivity', t => {
  t.true(fuzzyMatch('build', 'BUILD'));
  t.true(fuzzyMatch('BUILD', 'build'));
  t.true(fuzzyMatch('Build', 'bUILD'));
  t.true(fuzzyMatch('TeSt', 'test'));
});

test('fuzzyMatch - subsequence matching', t => {
  // Standard fuzzy matching
  t.true(fuzzyMatch('bui', 'build'));
  t.true(fuzzyMatch('bld', 'build'));
  t.true(fuzzyMatch('bd', 'build'));
  t.true(fuzzyMatch('b', 'build'));

  // Complex patterns
  t.true(fuzzyMatch('bw', 'build:watch'));
  t.true(fuzzyMatch('bu:wa', 'build:watch'));
  t.true(fuzzyMatch('test:u', 'test:unit'));
  t.true(fuzzyMatch('ts:u', 'test:unit'));
});

test('fuzzyMatch - non-matching patterns', t => {
  // Characters not present
  t.false(fuzzyMatch('xyz', 'build'));
  t.false(fuzzyMatch('q', 'build'));

  // Wrong order
  t.false(fuzzyMatch('dlib', 'build')); // 'd' appears before 'l' in pattern but after in string
  t.false(fuzzyMatch('tset', 'test')); // Wrong order

  // Pattern longer than string
  t.false(fuzzyMatch('building', 'build'));
  t.false(fuzzyMatch('testing', 'test'));
});

test('fuzzyMatch - edge cases', t => {
  // Empty pattern matches everything
  t.true(fuzzyMatch('', 'anything'));
  t.true(fuzzyMatch('', 'build'));
  t.true(fuzzyMatch('', 'test:long:name'));

  // Non-empty pattern vs empty string
  t.false(fuzzyMatch('a', ''));
  t.false(fuzzyMatch('test', ''));

  // Single character matches
  t.true(fuzzyMatch('a', 'a'));
  t.true(fuzzyMatch('a', 'abc'));
  t.true(fuzzyMatch('c', 'abc'));
  t.false(fuzzyMatch('d', 'abc'));
});

test('fuzzyMatch - real-world npm script scenarios', t => {
  const scripts = [
    'build',
    'build:prod',
    'build:dev',
    'build:watch',
    'test',
    'test:unit',
    'test:e2e',
    'test:watch',
    'lint',
    'lint:fix',
    'start',
    'start:dev',
    'dev',
    'serve',
    'deploy',
  ];

  // 'bu' should match all build scripts
  const buildMatches = scripts.filter(s => fuzzyMatch('bu', s));
  t.true(buildMatches.includes('build'));
  t.true(buildMatches.includes('build:prod'));
  t.true(buildMatches.includes('build:dev'));
  t.true(buildMatches.includes('build:watch'));
  t.false(buildMatches.includes('test'));

  // 'test' should match all test scripts
  const testMatches = scripts.filter(s => fuzzyMatch('test', s));
  t.true(testMatches.includes('test'));
  t.true(testMatches.includes('test:unit'));
  t.true(testMatches.includes('test:e2e'));
  t.true(testMatches.includes('test:watch'));
  t.false(testMatches.includes('build'));

  // 'tw' should match test:watch
  t.true(fuzzyMatch('tw', 'test:watch'));
  t.false(fuzzyMatch('tw', 'test:unit'));

  // 'dev' should match both dev and build:dev
  t.true(fuzzyMatch('dev', 'dev'));
  t.true(fuzzyMatch('dev', 'build:dev'));
  t.true(fuzzyMatch('dev', 'start:dev'));
});

test('fuzzyMatch - special characters and symbols', t => {
  // Colon-separated script names
  t.true(fuzzyMatch('b:p', 'build:prod'));
  t.true(fuzzyMatch('t:u', 'test:unit'));

  // Hyphenated script names
  t.true(fuzzyMatch('lf', 'lint-fix'));
  t.true(fuzzyMatch('l-f', 'lint-fix'));

  // Mixed separators
  t.true(fuzzyMatch('bp', 'build_prod'));
  t.true(fuzzyMatch('b_p', 'build_prod'));

  // Numbers in script names
  t.true(fuzzyMatch('e2', 'test:e2e'));
  t.true(fuzzyMatch('v1', 'build:v1.0'));
});

// Script classification tests
test('isHookScript - pre/post hooks', t => {
  // Pre hooks
  t.true(isHookScript('prebuild'));
  t.true(isHookScript('pretest'));
  t.true(isHookScript('prestart'));
  t.true(isHookScript('preinstall'));
  t.true(isHookScript('prepare')); // Note: 'prepare' itself is a hook, not 'preprepare'

  // Post hooks
  t.true(isHookScript('postbuild'));
  t.true(isHookScript('posttest'));
  t.true(isHookScript('poststart'));
  t.true(isHookScript('postinstall'));

  // Regular scripts (not hooks)
  t.false(isHookScript('build'));
  t.false(isHookScript('test'));
  t.false(isHookScript('start'));
  t.false(isHookScript('lint'));
  t.false(isHookScript('dev'));
});

test('isHookScript - npm lifecycle hooks', t => {
  // Built-in npm lifecycle hooks
  t.true(isHookScript('install'));
  t.true(isHookScript('prepare'));
  t.true(isHookScript('publish'));
  t.true(isHookScript('version'));
  t.true(isHookScript('dependencies'));
  t.true(isHookScript('shrinkwrap'));

  // Not lifecycle hooks
  t.false(isHookScript('build'));
  t.false(isHookScript('test'));
  t.false(isHookScript('clean'));
  t.false(isHookScript('deploy'));
});

test('isHookScript - edge cases and npm hook behavior', t => {
  // Scripts that contain 'pre' or 'post' but aren't hooks (not at start)
  t.false(isHookScript('compress')); // contains 'pre' but not at start
  t.false(isHookScript('represent')); // contains 'pre' but not at start

  // NPM treats ANY script starting with 'pre' or 'post' as a hook
  t.true(isHookScript('prebuild')); // This IS a hook
  t.true(isHookScript('postprocess')); // This IS a hook (post + process)
  t.true(isHookScript('postpone')); // This IS a hook (npm behavior)
  t.true(isHookScript('preanything')); // This IS a hook (npm behavior)

  // Case sensitivity
  t.false(isHookScript('PreBuild')); // Should be case sensitive
  t.false(isHookScript('PostTest')); // Should be case sensitive

  // Empty and edge cases
  t.false(isHookScript(''));
  t.false(isHookScript('pre'));
  t.false(isHookScript('post'));

  // Very short scripts
  t.false(isHookScript('p'));
  t.false(isHookScript('pr'));
  t.false(isHookScript('po'));
});

test('isHookScript - real-world package.json scenarios', t => {
  // Typical package.json scripts object
  const typicalScripts = {
    prebuild: 'echo "Starting build"',
    build: 'tsc',
    postbuild: 'echo "Build complete"',
    pretest: 'npm run build',
    test: 'ava',
    posttest: 'echo "Tests complete"',
    prepare: 'npm run build',
    start: 'node dist/index.js',
    dev: 'tsc --watch',
    lint: 'eslint src/',
    'lint:fix': 'eslint src/ --fix',
  };

  const scriptNames = Object.keys(typicalScripts);
  const hooks = scriptNames.filter(isHookScript);
  const regularScripts = scriptNames.filter(name => !isHookScript(name));

  // Verify hooks are correctly identified
  t.true(hooks.includes('prebuild'));
  t.true(hooks.includes('postbuild'));
  t.true(hooks.includes('pretest'));
  t.true(hooks.includes('posttest'));
  t.true(hooks.includes('prepare'));

  // Verify regular scripts are not identified as hooks
  t.true(regularScripts.includes('build'));
  t.true(regularScripts.includes('test'));
  t.true(regularScripts.includes('start'));
  t.true(regularScripts.includes('dev'));
  t.true(regularScripts.includes('lint'));
  t.true(regularScripts.includes('lint:fix'));

  // Ensure no overlap
  t.is(hooks.length + regularScripts.length, scriptNames.length);
});
