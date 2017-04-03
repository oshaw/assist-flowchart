'use strict'

const assist = require('./assist-scraper.js')

module.exports = function (query, callback, error) {
  switch (query.endpoint) {
    case 'origins': {
      assist.getOrigins(function (origins) { callback(origins) })
      break
    }
    case 'destinations': {
      if (!query.hasOwnProperty('origin')) {
        error('Error: Origin not specified')
      } else {
        assist.getDestinationsAndYears(query.origin, function (destinationsAndYears) {
          callback(destinationsAndYears)
        })
      }
      break
    }
    case 'majors': {
      if (!query.hasOwnProperty('origin')) {
        error('Error: Origin not specified')
        break
      }
      if (!query.hasOwnProperty('destination')) {
        error('Error: Destination not specified')
        break
      }
      if (!query.hasOwnProperty('year')) {
        error('Error: Year not specified')
        break
      }
      assist.getMajors(query.origin, query.destination, query.year, function (majors) {
        callback(majors)
      })
      break
    }
    case 'agreement': {
      if (!query.hasOwnProperty('origin')) {
        error('Error: Origin not specified')
        break
      }
      if (!query.hasOwnProperty('destination')) {
        error('Error: Destination not specified')
        break
      }
      if (!query.hasOwnProperty('year')) {
        error('Error: Year not specified')
        break
      }
      if (!query.hasOwnProperty('major')) {
        error('Error: Major not specified')
        break
      }
      assist.getAgreement(query.origin, query.destination, query.year, query.major, function (agreement) {
        callback(agreement)
      })
      break
    }
    default: error('Error: Endpoint invalid or not specified')
  }
}
