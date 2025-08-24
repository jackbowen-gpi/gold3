const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleTracker = require("webpack-bundle-tracker");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";
  // Allow overriding the public host used in dev so containerized test runners can reach webpack-dev-server.
  // e.g. WEBPACK_PUBLIC_HOST=http://host.docker.internal:3000
  const webpackPublicHost = process.env.WEBPACK_PUBLIC_HOST || (isDev ? "http://host.docker.internal:3000" : "http://localhost:3000");
  const nodeModulesDir = path.resolve(__dirname, "node_modules");
  const localhostOutput = {
    path: path.resolve("./frontend/webpack_bundles/"),
  publicPath: `${webpackPublicHost}/frontend/webpack_bundles/`,
  // Use chunkhash in dev so filenames match the production manifest (helps dockerized smoke tests)
  filename: "[name]-[chunkhash].js",
  };
  const productionOutput = {
    path: path.resolve("./frontend/webpack_bundles/"),
    // Use an explicit publicPath for production builds so the backend/CI can resolve assets reliably.
    publicPath: `${webpackPublicHost}/frontend/webpack_bundles/`,
    filename: "[name]-[chunkhash].js",
    clean: true,
  };

  return {
    mode: isDev ? "development" : "production",
    devtool: "source-map",
    devServer: {
      hot: true,
      historyApiFallback: true,
      host: "0.0.0.0",
      port: 3000,
      // Accept requests from other hosts (helpful for headless smoke tests and Docker)
      allowedHosts: 'all',
      // Allow CORS requests from the Django dev server domain:
      headers: { "Access-Control-Allow-Origin": "*" },
      // Ensure dev middleware serves bundles under the same publicPath used in the bundle tracker
      // and write bundles to disk so the backend and external test runners (Puppeteer in Docker)
      // can fetch the exact filenames referenced in the manifest.
      devMiddleware: {
        publicPath: '/frontend/webpack_bundles/',
        writeToDisk: true,
      },
    },
    context: __dirname,
    entry: ["./frontend/js/index.tsx"],
    output: isDev ? localhostOutput : productionOutput,
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: {
            loader: "swc-loader",
            options: {
              // disable .swcrc to keep loader config explicit for CI and production
              swcrc: false,
              jsc: {
                parser: {
                  // parse TypeScript/TSX files correctly
                  syntax: "typescript",
                  tsx: true,
                  jsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                  },
                },
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isDev && "style-loader",
            !isDev && MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env"]],
                },
              },
            },
          ].filter(Boolean),
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            isDev && "style-loader",
            // Optimizes CSS in chunks
            !isDev && MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ].filter(Boolean),
        },
        {
          test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: "asset",
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
          type: "asset",
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp)?$/,
          type: "asset",
        },
      ],
    },
    plugins: [
      !isDev &&
      new MiniCssExtractPlugin({ filename: "[name]-[chunkhash].css" }),
      isDev && new ReactRefreshWebpackPlugin(),
      new BundleTracker({
        path: __dirname,
        filename: "webpack-stats.json",
        publicPath: isDev ? `${webpackPublicHost}/frontend/webpack_bundles/` : productionOutput.publicPath,
      }),
    ].filter(Boolean),
    resolve: {
      modules: [nodeModulesDir, path.resolve(__dirname, "frontend/js/")],
      // Prefer TypeScript/TSX sources when both .js and .tsx exist.
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    optimization: {
      minimize: !isDev,
      splitChunks: {
        // include all types of chunks
        chunks: "all",
      },
    },
  };
};
