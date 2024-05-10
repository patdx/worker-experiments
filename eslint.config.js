import js from '@eslint/js';
import eslintPluginSqlFormatter from 'eslint-plugin-sql-formatter';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'sql-formatter': eslintPluginSqlFormatter,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      'sql-formatter/format': [
        'error',
        {
          ignoreSingleLine: true,
          sqlFormatterConfig: {
            language: 'sqlite',
            keywordCase: 'upper',
          },
        },
      ],
    },
  }
);
