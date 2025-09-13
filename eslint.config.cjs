module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react')
    },
    settings: {
      react: { version: 'detect' }
    },
    // Merge recommended rule sets from plugins by extracting their rules only
    rules: (function () {
      const tsConfig = require('@typescript-eslint/eslint-plugin').configs.recommended || {};
      const reactConfig = require('eslint-plugin-react').configs.recommended || {};
      const tsRules = tsConfig.rules || {};
      const reactRules = reactConfig.rules || {};
      return Object.assign({}, tsRules, reactRules, {
        // Project-specific overrides
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off'
      });
    })()
  },
  // Allow explicit any in declaration files only
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];