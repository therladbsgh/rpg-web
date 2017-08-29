var webpack = require('webpack');
// var cssnext = require('postcss-cssnext');
// var postcssFocus = require('postcss-focus');
// var postcssReporter = require('postcss-reporter');
var path = require('path');

var phaserModulePath = path.join(__dirname, '/node_modules/phaser-ce/');

module.exports = {
  context: __dirname,

  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: [
      'eventsource-polyfill',
      './client/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },

  output: {
    path: __dirname,
    filename: '[name].js',
    publicPath: 'http://0.0.0.0:3000/',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
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
    rules: [
      {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel-loader',
      }, {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1&sourceMap',
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'sass-loader' ],
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
      },
    ],
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

};
