import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { importX } from 'eslint-plugin-import-x'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sonarjs from 'eslint-plugin-sonarjs'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'docs',
      'naosubir',
      'reports',
      'playwright-report',
      'test-results',
      'public/mockServiceWorker.js',
      'src/routeTree.gen.ts',
      '.lighthouseci',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2023, globals: { ...globals.browser, ...globals.node } },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-x': importX,
      sonarjs,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import-x/no-duplicates': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicate-string': ['warn', { threshold: 4 }],
      'sonarjs/cognitive-complexity': ['warn', 15],
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: 80, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'axios', message: 'Use the client in @/shared/api/http-client.' }],
          patterns: [
            {
              group: ['@/mocks/*', '@/mocks'],
              message: 'The mocks layer is only imported by src/main.tsx.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/api/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['src/main.tsx', 'src/mocks/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'axios', message: 'Mocks do not use axios.' }] },
      ],
    },
  },
  {
    files: ['src/shared/ui/**'],
    rules: { 'react/no-multi-comp': 'off', 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['src/routes/**'],
    rules: { 'react-refresh/only-export-components': ['warn', { allowExportNames: ['Route'] }] },
  },
  {
    files: ['src/mocks/**', 'scripts/**', 'e2e/**', '*.config.ts'],
    rules: { 'max-lines-per-function': 'off', 'sonarjs/no-duplicate-string': 'off' },
  },
  {
    files: ['src/mocks/db/fixtures/nfts.ts', 'src/mocks/scenarios/presets.ts'],
    rules: { 'max-lines': 'off' },
  },
  {
    files: ['e2e/**'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: globals.node },
  },
  prettier,
)
