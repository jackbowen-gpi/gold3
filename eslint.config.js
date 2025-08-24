// Minimal flat config to run ESLint in flat-config mode.
// It provides languageOptions.parser and basic overrides to match the project's needs.
module.exports = [
  // TypeScript files in the frontend only: use the typescript parser and the project's tsconfig
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
      },
    },
    plugins: {
      // explicitly require the plugin module so rule definitions are available
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    },
  },

  // JavaScript files: use default parser (no tsconfig project)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    },
  },
];

