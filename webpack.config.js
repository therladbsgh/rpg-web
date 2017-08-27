var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var phaserModulePath = path.join(__dirname, '/node_modules/phaser-ce/');

module.exports = {
  context: __dirname,

  entry: "./lib/js/index.js",

  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      'client',
      'node_modules',
    ],
    alias: {
      'phaser': path.join(phaserModulePath, 'build/custom/phaser-split.js'),
      'pixi': path.join(phaserModulePath, 'build/custom/pixi.js'),
      'p2': path.join(phaserModulePath, 'build/custom/p2.js'),
    },
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /pixi\.js/,
        loader: 'expose-loader?PIXI',
      },
      {
        test: /phaser-split\.js$/,
        loader: 'expose-loader?Phaser',
      },
      {
        test: /p2\.js/,
        loader: 'expose-loader?p2',
      },
      {
        test: /phaser-arcade-slopes.min\.js$/,
        loader: 'expose-loader?SAT',
      }
    ],
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
