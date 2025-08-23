module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // your rules here
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
  globals: {
    process: "readonly",
  },
};
