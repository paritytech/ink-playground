const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const tailwindcss = require('tailwindcss');
const { EnvironmentPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const inkEditorConfig = require('../ink-editor/webpack.config');

const localConfig = {
  mode: 'development',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    filename: 'bundle.[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm', '.css'],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
      '@paritytech/ink-editor': path.resolve(__dirname, '../ink-editor/src'),
      '@paritytech/components': path.resolve(__dirname, '../components/src'),
    },
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [tailwindcss('./tailwind.config.js'), require('autoprefixer')],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new htmlWebpackPlugin({
      title: 'Parity ink! Playground',
      template: './src/index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: false,
      statsFilename: '../bundle-size-stats.json',
    }),
    new EnvironmentPlugin({
      COMPILE_URL: '',
      GIST_CREATE_URL: '',
      GIST_LOAD_URL: '',
      RUST_FORMAT_URL: '',
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
  devServer: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};

module.exports = merge(inkEditorConfig, localConfig);
