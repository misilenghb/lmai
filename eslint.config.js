// ESLint 配置文件，适用于 Next.js + TypeScript
const { ESLint } = require('eslint');

module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier'
  ],
  rules: {
    // 可根据需要自定义规则
    'no-unused-vars': 'warn',
    'react/display-name': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};