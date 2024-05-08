import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off', 
      'eqeqeq': 'error', 
      'indent': ['error', 2], 
      'semi': ['error', 'always'], 
      'quotes': ['error', 'single'],
    },
  },
  pluginJs.configs.recommended,
];