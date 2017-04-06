'use strict'

const api = require('./api-handler.js')
const parser = require('./parse-agreement.js')
const prereq = require('./get-dvc-prereq.js')

module.exports = function (server, root) {
  server.get('/api', function (req, res) {
    api(req.query, function (data) { res.send(data) }, function (data) { res.send(data) })
  })
  server.get('*', function (req, res) {
    if (req.query.endpoint !== undefined) {
      api(req.query, function (data) { res.send(data) }, function () {})
    } else res.sendFile(root + '/client/view.html')
  })
}
