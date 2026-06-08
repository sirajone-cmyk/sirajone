import js from '@eslint/js';
import globals from 'globals';

export default [
  // Ignore build output and dependencies
  { ignores: ['dist', 'node_modules', 'public'] },

  // All JS/JSX source files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Downgrade unused vars to warnings so CI doesn't fail on WIP code
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      // Keep console.log warnings off in dev — tighten later
      'no-console': 'off',
    },
  },
];
