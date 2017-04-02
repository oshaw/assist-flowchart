'use strict'

const path = require('path.join')

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render(path(__dirname, 'index.jade'))
  })
}
