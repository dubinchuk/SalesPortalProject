import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Config[]} */
export default [
  {
    files: ['src/**/*.ts', 'playwright.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2021,
      },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': ['warn', { 'newlines-between': 'always' }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.js'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
