const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleTracker = require("webpack-bundle-tracker");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";
  // Allow overriding the public host used in dev so containerized test runners can reach webpack-dev-server.
  // e.g. WEBPACK_PUBLIC_HOST=http://host.docker.internal:3000
  const webpackPublicHost = process.env.WEBPACK_PUBLIC_HOST || (isDev ? "http://host.docker.internal:3000" : "http://localhost:3000");
  // When WEBPACK_PUBLIC_HOST is not explicitly provided in development,
  // prefer a relative publicPath so the backend can serve bundles from
  // its configured staticfiles locations if the dev-server is not running.
  const devPublicPathFallback = process.env.WEBPACK_PUBLIC_HOST ? `${webpackPublicHost}/frontend/webpack_bundles/` : '/frontend/webpack_bundles/';
  const nodeModulesDir = path.resolve(__dirname, "node_modules");
  const localhostOutput = {
    path: path.resolve("./frontend/webpack_bundles/"),
    // Use an explicit absolute public host when provided (useful for
    // containerized setups). Otherwise use a relative publicPath so
    // Django's staticfiles can serve the files if the dev-server is
    // not running. This avoids hard failures when localhost:3000 is
    // unavailable.
    publicPath: devPublicPathFallback,
    // In development, emit un-hashed filenames so the dev-server can be
    // referenced as a stable URL (e.g. /frontend/webpack_bundles/main.js).
    // Production continues to use hashed filenames for caching.
    filename: "[name].js",
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
      // Reduce client-side and middleware logging noise to avoid duplicated startup messages
      client: {
        logging: 'warn',
        overlay: false,
        // Ensure the client connects to the correct websocket URL when the dev-server
        // is containerized. webpackPublicHost is set above to host.docker.internal in dev
        // which allows the browser on the host to reach the dev-server inside Docker.
        webSocketURL: webpackPublicHost.replace(/^http/, 'ws'),
      },
      
      // Allow CORS requests from the Django dev server domain and set a
      // development-only Content-Security-Policy that permits loading bundles
      // from the dev-server. This overrides any restrictive defaults present
      // in the environment and is safe because it only applies to `mode=development`.
      headers: {
        "Access-Control-Allow-Origin": "*",
        // Permit scripts/styles from any origin in dev (keeps Puppeteer and
        // containerized test runners happy). Adjust if you want to be stricter.
        "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' blob:; style-src * 'unsafe-inline'"
  ,
  // Allow cross-origin embedding of resources when the top-level page
  // sets a Cross-Origin-Opener-Policy (COOP). Without this, Chrome
  // blocks cross-origin subresources with ERR_BLOCKED_BY_ORB.
  "Cross-Origin-Resource-Policy": "cross-origin",
      },
      // Some environments or middleware may inject a restrictive Content-Security-Policy
      // (for example "default-src 'none'") which blocks loading dev bundles from the
      // dev-server itself. In development, strip any Content-Security-Policy header so
      // the backend-provided CSP (or no CSP) governs resource loading.
      setupMiddlewares: (middlewares, devServer) => {
        // Insert a first-run middleware that strips Content-Security-Policy.
        // By adding it to the front of `middlewares` we ensure it runs before
        // webpack-dev-server's static/content handlers which may add headers.
        const stripCsp = {
          name: 'strip-csp',
          path: '/',
          middleware: (req, res, next) => {
            // Wrap writeHead to remove or replace CSP at the last moment.
            const origWriteHead = res.writeHead;
            res.writeHead = function writeHead() {
              try {
                // Remove any header already set on the response.
                res.removeHeader && res.removeHeader('Content-Security-Policy');
                // Also sanitize headers object if provided as arg.
                for (let i = 0; i < arguments.length; i++) {
                  const arg = arguments[i];
                  if (arg && typeof arg === 'object') {
                    delete arg['content-security-policy'];
                    delete arg['Content-Security-Policy'];
                  }
                }
                // Explicitly set a permissive development CSP so downstream
                // middleware or the dev-server runtime doesn't leave a
                // restrictive default-src 'none' in place.
                res.setHeader && res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' blob:; style-src * 'unsafe-inline'");
              } catch (err) {
                // ignore
              }
              return origWriteHead.apply(this, arguments);
            };
            next();
          },
        };

        // Ensure our middleware is first.
        middlewares.unshift(stripCsp);
        return middlewares;
      },
      // Ensure dev middleware serves bundles under the same publicPath used in the bundle tracker
      // and write bundles to disk so the backend and external test runners (Puppeteer in Docker)
      // can fetch the exact filenames referenced in the manifest.
      devMiddleware: {
        publicPath: '/frontend/webpack_bundles/',
        // In development, write bundles to disk so the backend (and external
        // test runners) can fetch exact filenames the manifest references.
        // This avoids problems where the dev-server serves bundles only from
        // memory and the backend cannot resolve them.
        writeToDisk: true,
        stats: 'errors-warnings',
      },
      // Proxy API requests to the Django backend so the frontend dev-server can
      // act as a same-origin proxy during development. This avoids cross-site
      // cookie / SameSite issues when the frontend is served from :3000 and the
      // backend runs on :8000. Use the array schema expected by newer
      // webpack-dev-server versions.
      proxy: [
        {
          context: ['/api'],
          target: 'http://backend:8000',
          secure: false,
          changeOrigin: true,
        },
      ],
    },
    // Reduce internal webpack infrastructure logs (keeps errors visible but silences info/debug)
    infrastructureLogging: {
      level: 'warn',
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
        // Mirror the dev publicPath recommendation above: when a specific
        // WEBPACK_PUBLIC_HOST is provided use it, otherwise prefer the
        // relative path so the backend/staticfiles can satisfy requests.
        publicPath: isDev ? devPublicPathFallback : productionOutput.publicPath,
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
