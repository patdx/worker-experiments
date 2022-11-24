module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-sql-formatter'],
  root: true,
  rules: {
    'sql-formatter/format': [
      'error',
      {
        // Everything is optional.
        ignoreSingleLine: true, // Do not format if sql query fits single line. Enabled by default.
        sqlFormatterConfig: {
          // https://github.com/sql-formatter-org/sql-formatter#configuration-options

          language: 'sqlite',
          keywordCase: 'upper',
          // ... any other option from sql-formatter
        },
      },
    ],
  },
};
