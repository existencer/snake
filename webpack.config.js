const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './main.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: { presets: ['es2017'] },
      }],
    }],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].bundle.js',
  },
};