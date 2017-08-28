var fs = require('fs');
var path = require('path');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var phaserModulePath = path.join(__dirname, '/node_modules/phaser-ce/');

module.exports = {

  entry: path.resolve(__dirname, 'server/server.js'),

  output: {
    path: __dirname + '/dist/',
    filename: 'server.bundle.js',
  },

  target: 'node',

  node: {
    __filename: true,
    __dirname: true,
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
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
            'stage-2',
          ],
        },
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.mp4$/,
        loader: 'url?limit=10000&mimetype=video/mp4'
      },
      {
        test: /\.html$/,
        loader: 'html-loader?attrs[]=video:src'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: "sass-loader"
        })
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

  plugins: [
    new ExtractTextPlugin('app.[chunkhash].css', { allChunks: true }),
  ],

  externals: [nodeExternals()],
};
