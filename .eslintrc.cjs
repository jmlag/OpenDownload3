module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  globals: {
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'no-console': ['error', { allow: ['error'] }],
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    'import/extensions': ['error', 'ignorePackages'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'prefer-destructuring': ['error', { array: false }],
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, consistent: true, minProperties: 6 },
      ObjectPattern: { multiline: true, consistent: true, minProperties: 6 },
      ImportDeclaration: { multiline: true, consistent: true, minProperties: 6 },
      ExportDeclaration: { multiline: true, consistent: true, minProperties: 6 },
    }],
  },
};
