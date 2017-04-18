'use strict'
const path = require('path')

module.exports = {
  devServer: {
    inline: true,
    contentBase: './client/build',
    port: 3000
  },
  entry: './client/client.js',
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'build/bundle.js'
  },
  module: {loaders: [{test: /\.css$/, loader: 'style!css'}]}
}
