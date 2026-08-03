// @ts-check

const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  {
    ignores: ['projects/**/*', '*.css'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      ...angular.configs.tsRecommended,
      prettierRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // This rule was added to the v22 recommended preset. Preserve the
      // project's existing change-detection policy during this migration.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, prettierRecommended],
    rules: {
      'prettier/prettier': ['error', { parser: 'angular' }],
    },
  },
);
