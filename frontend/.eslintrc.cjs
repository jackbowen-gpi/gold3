module.exports = {
  // This file enforces espree for JS files under frontend so the
  // TypeScript parser and its `project` option are not applied to them.
  overrides: [
    {
      files: ["src/**/*.js", "src/**/*.jsx"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      rules: {},
    },
  ],
};
