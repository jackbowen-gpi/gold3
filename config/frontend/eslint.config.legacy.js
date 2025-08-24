const path = require("path");

module.exports = {
  root: true,
  // Use espree as the default parser so JS files don't trigger
  // typescript-eslint's type-aware parsing (which requires parserOptions.project).
  parser: "espree",
  // Ensure no inherited parserOptions.project leaks in from extended configs.
  parserOptions: {},
  extends: ["vinta/recommended-typescript"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        paths: [path.resolve(__dirname, "../../node_modules")],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      webpack: {
        config: path.join(__dirname, "../../webpack.config.js"),
        "config-index": 1,
      },
      typescript: {
        alwaysTryTypes: true,
        project: "../../tsconfig.json",
      },
    },
    react: {
      version: "detect",
    },
  },
  // Ignore generated bundles and generated API code which cause many false
  // positives and rule resolution problems.
  ignorePatterns: [
  "frontend/webpack_bundles/**",
  "frontend/webpack-stats.json",
  "frontend/bundles/**",
  "frontend/js/api/**",
  "**/*.map",
  "frontend/**/*.map",
  ],
  // Use the TypeScript parser only for TS/TSX files so JS files avoid
  // type-aware parsing (which needs parserOptions.project).
  overrides: [
    {
      // Force JS files in frontend/src to use espree so parserOptions.project
      // (TypeScript) is not applied to them.
      files: ["frontend/src/**/*.js", "frontend/src/**/*.jsx"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        // project path relative to this config file
        project: path.join(__dirname, "../../tsconfig.json"),
        tsconfigRootDir: path.resolve(__dirname, "../../"),
      },
      // Prevent the TypeScript override from applying to JS files in frontend
      // (some JS files are not part of the tsconfig and caused parser errors).
      excludedFiles: ["frontend/js/**", "**/*.js", "**/*.jsx"],
    },
    {
      // Ensure plain JS files use espree (default) so they don't trigger
      // typescript-eslint's type-aware parsing which requires a project.
      files: ["**/*.js", "**/*.jsx"],
      parser: "espree",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    {
      files: ["openapi-ts.config.ts"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
  ],
};
