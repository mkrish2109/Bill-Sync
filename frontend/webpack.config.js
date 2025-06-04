const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    publicPath: "/",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: process.env.NODE_ENV === "production",
            drop_debugger: process.env.NODE_ENV === "production",
            pure_funcs:
              process.env.NODE_ENV === "production"
                ? ["console.log", "console.info", "console.debug"]
                : [],
            passes: 3,
            reduce_funcs: true,
            reduce_vars: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
            collapse_vars: true,
            reduce_vars: true,
            unsafe: true,
            unsafe_arrows: true,
            unsafe_comps: true,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true,
            unsafe_undefined: true,
          },
          mangle: {
            safari10: true,
            toplevel: true,
            properties: {
              regex: /^_/,
            },
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
            beautify: false,
          },
        },
        extractComments: false,
      }),
    ],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 20000,
      maxSize: 244 * 1024, // 244 KiB - aiming for better cache granularity
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `vendor.${packageName.replace("@", "")}`;
          },
          priority: 10,
        },
        charts: {
          test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
          name: "charts",
          priority: 20,
          enforce: true,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: "react",
          priority: 30,
        },
        commons: {
          name: "commons",
          minChunks: 2,
          chunks: "async",
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: "/",
      generate: (seed, files) => ({
        files: files.reduce((manifest, { name, path }) => {
          manifest[name] = path;
          return manifest;
        }, seed),
      }),
    }),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 },
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    }),
    process.env.ANALYZE &&
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: "bundle-report.html",
        openAnalyzer: false,
      }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                  useBuiltIns: "usage",
                  corejs: 3,
                  targets: {
                    browsers: ["last 2 versions", "not dead", "not IE 11"],
                  },
                },
              ],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                  development: process.env.NODE_ENV !== "production",
                },
              ],
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: false,
                  helpers: true,
                  regenerator: true,
                  useESModules: true,
                },
              ],
              "@babel/plugin-syntax-dynamic-import",
              "lodash",
              process.env.NODE_ENV === "production" && [
                "transform-react-remove-prop-types",
                { removeImport: true },
              ],
              process.env.NODE_ENV === "production" && [
                "transform-remove-console",
                { exclude: ["error", "warn"] },
              ],
            ].filter(Boolean),
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName:
                  process.env.NODE_ENV === "production"
                    ? "[hash:base64:8]"
                    : "[path][name]__[local]",
              },
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "react-dom$": "react-dom/profiling",
      "scheduler/tracing": "scheduler/tracing-profiling",
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    static: {
      directory: path.join(__dirname, "build"),
      publicPath: "/",
      serveIndex: true,
      watch: true,
    },
    headers: {
      "Cache-Control": "no-store", // Disable caching in dev to prevent issues
    },
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
};
