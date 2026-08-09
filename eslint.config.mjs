import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import nextPlugin from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const WEB_APP_FILES = [
  'apps/merchant-web/**/*.{js,jsx,ts,tsx}',
  'apps/admin-web/**/*.{js,jsx,ts,tsx}',
  'apps/checkout-web/**/*.{js,jsx,ts,tsx}',
];

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      'bun.lockb',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Registered globally so Next.js detects it via calculateConfigForFile.
    plugins: {
      '@next/next': nextPlugin,
    },
  },
  {
    files: WEB_APP_FILES,
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      ...react.configs.flat.recommended.languageOptions,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['**/next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  eslintConfigPrettier,
);
