import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'web', 'node_modules'] },

  // App code: browser, React 18 with the automatic JSX runtime (Vite).
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      // No TypeScript/PropTypes in this project.
      'react/prop-types': 'off',
      // UI copy is French, full of apostrophes; only flag characters that break JSX.
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
      // ignoreRestSiblings: `const { omitted, ...rest } = obj` is used to drop fields.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      // Every statement ends with a semicolon.
      semi: ['error', 'always'],
    },
  },

  // Context modules export a Provider alongside its hook/constants — the standard
  // pattern. Editing them triggers a full reload instead of Fast Refresh, which is fine.
  {
    files: ['src/context/**', 'src/i18n/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Tooling config files run in Node.
  {
    files: ['*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ['error', 'always'],
    },
  },
];
