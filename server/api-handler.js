'use strict'

const assist = require('./assist-scraper.js')
const parser = require('./parse-agreement.js')

module.exports = function (query, callback, error) {
  switch (query.endpoint) {
    case 'origins': {
      assist.getOrigins(function (data) { callback(data) })
      break
    }
    case 'destinations': {
      if (!query.hasOwnProperty('origin')) {
        error('Error: Origin not specified')
        break
      }
      assist.getDestinationsAndYears(query.origin, function (data) {
        callback(data)
      })
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
      assist.getMajors(query.origin, query.destination, query.year, function (data) {
        callback(data)
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
      assist.getAgreement(query.origin, query.destination, query.year, query.major, function (data) {
        callback(parser(data.agreement))
      })
      break
    }
    case 'resolveOriginName': {
      if (!query.hasOwnProperty('origin')) {
        error('Error: Origin not specified')
        break
      }
      assist.resolveOriginName(query.origin, function (data) { callback(data) })
      break
    }
    case 'resolveDestinationAndOriginName': {
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
      assist.resolveDestinationAndOriginName(query.origin, query.destination, query.year, function (data) { callback(data) })
      break
    }
    default: error('Error: Endpoint invalid or not specified')
  }
}
