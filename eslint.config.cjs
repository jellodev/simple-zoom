const globals = require('globals');

module.exports = {
  languageOptions: {
    globals: {
      ...globals.browser,
      io: 'readonly',
      __dirname: 'readonly',
    },
  },
  plugins: {
    prettier: require('eslint-plugin-prettier'),
  },
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
};
