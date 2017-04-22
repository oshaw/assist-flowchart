'use strict'
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devServer: {
    inline: true,
    contentBase: './client/build',
    port: 3000
  },
  entry: './client/client.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'build/bundle.min.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}
