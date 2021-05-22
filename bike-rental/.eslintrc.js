module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  extends: [
    'plugin:optimize-regex/recommended',
    'plugin:array-func/all',
    'plugin:json/recommended',
    'plugin:promise/recommended',
    'plugin:security/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript',
    'plugin:prettier/recommended',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    // 'no-unneeded-ternary': 'warn',
    // staying, functions are naturally hoisted
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
};
