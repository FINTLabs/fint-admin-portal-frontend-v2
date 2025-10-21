import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import cypress from 'eslint-plugin-cypress';
import globals from 'globals';

/**
 * ESLint flat config for React Router v7 + TypeScript project
 */
export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'build/**',
      '.cache/**',
      'coverage/**',
      '.react-router/**',
      '.well-known/**',
      '.nyc_output/**',
      'public/mockServiceWorker.js',
    ],
  },

  // Base config for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // ESLint recommended rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // React configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
    },
  },

  // TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      import: importPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.ts', '.tsx'],
        },
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      // Allow unused vars that start with underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Config files (CommonJS)
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },

  // Cypress test files
  {
    files: ['cypress/**/*.{js,ts}'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        context: 'readonly',
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      '@typescript-eslint/no-namespace': 'off',
      // Allow cy.wait() with timeouts for now, can be stricter later
      'cypress/no-unnecessary-waiting': 'warn',
    },
  },
];

