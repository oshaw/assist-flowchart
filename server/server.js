'use strict'

const assist = require('./assist-scraper.js')

module.exports = function (server, root) {
  server.get('/api', function (req, res) {
    switch (req.query.endpoint) {
      case 'origins': {
        assist.getOrigins(function (origins) { res.send(origins) })
        break
      }
      case 'destinations': {
        if (!req.query.hasOwnProperty('origin')) {
          res.send('Error: Origin not specified')
        } else {
          assist.getDestinationsAndYears(req.query.origin, function (destinationsAndYears) {
            res.send(destinationsAndYears)
          })
        }
        break
      }
      case 'majors': {
        if (!req.query.hasOwnProperty('origin')) {
          res.send('Error: Origin not specified')
          break
        }
        if (!req.query.hasOwnProperty('destination')) {
          res.send('Error: Destination not specified')
          break
        }
        if (!req.query.hasOwnProperty('year')) {
          res.send('Error: Year not specified')
          break
        }
        assist.getMajors(req.query.origin, req.query.destination, req.query.year, function (majors) {
          res.send(majors)
        })
        break
      }
      case 'agreement': {
        if (!req.query.hasOwnProperty('origin')) {
          res.send('Error: Origin not specified')
          break
        }
        if (!req.query.hasOwnProperty('destination')) {
          res.send('Error: Destination not specified')
          break
        }
        if (!req.query.hasOwnProperty('year')) {
          res.send('Error: Year not specified')
          break
        }
        if (!req.query.hasOwnProperty('major')) {
          res.send('Error: Major not specified')
          break
        }
        assist.getAgreement(req.query.origin, req.query.destination, req.query.year, req.query.major, function (agreement) {
          res.send(agreement)
        })
        break
      }
      default: res.send('Error: Endpoint invalid or not specified')
    }
  })
  server.get('*', function (req, res) {
    res.sendFile(root + '/client/view.html')
  })
}
