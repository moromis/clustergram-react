module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'google',
    'prettier' // must be last
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'warn', // TODO: change this to error in the future
    'require-jsdoc': 0
  }
}
