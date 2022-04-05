const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const filenameimg = (ext) =>
  isDev ? `[name]${ext}` : `[name].[contenthash]${ext}`;

module.exports = {
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, 'dist'),
    // contentBase: path.join(__dirname, 'dist'),
    open: {
      app: {
        name: 'chrome',
        arguments: ['--incognito' /* , '--new-window' */],
      },
    },
    compress: true,
    hot: true,
    port: 3000,
  },

  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    assetModuleFilename: `./img/${filenameimg('[ext]')}`,
    // assetModuleFilename: 'images/[hash][ext][query]',
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
  devtool: isProd ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        // type: 'asset/resource',
      },
      // {
      //   test: /\.(?:|png|gif|jpg|jpeg|webp|svg)$/i,
      //   // dependency: { not: ['url'] },
      //   // use: [{
      //   //   loader: 'file-loader',
      //   //   options: {
      //   //       name: `./img/${filename('[ext]')}`,
      //   //   }
      //   // }],
      //   // // type: 'javascript/auto'
      //   // type: 'asset/resource'
      //   type: 'asset/resource'
      // },
      {
        test: /\.(?:|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `./fonts/${filename('[ext]')}`,
            },
          },
        ],
        type: 'asset/resource',
      },
    ],
  },
};
