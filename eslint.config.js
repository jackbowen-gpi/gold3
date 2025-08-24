// Minimal flat config to run ESLint in flat-config mode.
// It provides languageOptions.parser and basic overrides to match the project's needs.
module.exports = [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
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
      // eslint will resolve the plugin by name from node_modules
    },
    rules: {},
  },
];

