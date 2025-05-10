const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',

  devtool: 'cheap-module-source-map', // Melhor para desenvolvimento

  entry: './src/index.tsx', // Priorize .tsx, já que é um projeto React com TypeScript

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/bundle.[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    publicPath: '/',
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      serveIndex: false, // Evita o URIError
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    }
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   // presets: [
          //   //   '@babel/preset-env',
          //   //   ['@babel/preset-react', { runtime: 'automatic' }], // Suporte a JSX
          //   //   '@babel/preset-typescript', // Suporte a TypeScript
          //   // ],
          //   cacheDirectory: true,
          // },
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/, // Apenas para imports em JS/TS
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i, // SVG já tratado acima
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
};