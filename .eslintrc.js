'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.ts'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['**/*.js'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        'prefer-const': 'off',
        'no-unused-vars': 'off',
        'no-useless-escape': 'warn',
        'ember/no-classic-components': 'warn',
        'ember/no-component-lifecycle-hooks': 'warn',
        'ember/require-tagless-components': 'Warn',
        'ember/classic-decorator-hooks': 'error',
        'ember/classic-decorator-no-classic-methods': 'error',
      },
    },
  ],
};

// 'use strict';

// module.exports = {
//   root: true,
//   parser: "@typescript-eslint/parser",
//   // parser: 'babel-eslint',
//   // parserOptions: {
//   //   ecmaVersion: 2018,
//   //   sourceType: 'module',
//   //   ecmaFeatures: {
//   //     legacyDecorators: true,
//   //   },
//   // },
//   plugins: [
//     'ember',
//     '@typescript-eslint'
//   ],
//   extends: [
//     'eslint:recommended',
//     'plugin:ember/recommended',
//   ],
//   env: {
//     browser: true,
//   },
//   rules: {
//     'prefer-const': 'off',
//     'no-unused-vars': 'off',
//     "no-useless-escape": "warn",
//     "ember/no-classic-components": "warn",
//     "ember/no-component-lifecycle-hooks": "warn",
//     "ember/require-tagless-components": "Warn",
//     'ember/classic-decorator-hooks': 'error',
//     'ember/classic-decorator-no-classic-methods': 'error',
//   },
//   overrides: [
//     // typescript files
//     {
//       files: ['*.ts'],
//       extends: [
//         'plugin:@typescript-eslint/recommended',
//         'plugin:@typescript-eslint/recommended-requiring-type-checking',
//       ],
//       // parser: "@typescript-eslint/parser",
//       parserOptions: {
//         tsconfigRootDir: __dirname,
//         project: ['./tsconfig.json'],
//       },
//     },
//     // node files
//     {
//       files: [
//         './.eslintrc.js',
//         './.prettierrc.js',
//         './.template-lintrc.js',
//         './ember-cli-build.js',
//         './testem.js',
//         './blueprints/*/index.js',
//         './config/**/*.js',
//         './lib/*/index.js',
//         './server/**/*.js',
//       ],
//       parserOptions: {
//         sourceType: 'script',
//       },
//       env: {
//         browser: false,
//         node: true,
//       },
//       plugins: ['node'],
//       extends: ['plugin:node/recommended'],
//       rules: {
//         // this can be removed once the following is fixed
//         // https://github.com/mysticatea/eslint-plugin-node/issues/77
//         'node/no-unpublished-require': 'off',
//       },
//     },
//     {
//       // test files
//       files: ['tests/**/*-test.{js,ts}'],
//       extends: ['plugin:qunit/recommended'],
//     },
//   ],
// };
