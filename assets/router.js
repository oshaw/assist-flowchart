'use strict'

const path = require('path.join')

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.sendFile(path(__dirname, 'index.html'))
  })
}
