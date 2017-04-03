'use strict'

const request = require('./request.js')

let parseOrigins = function ($) {
  let output = []
  $('option').each(function (i, option) {
    if ($(this).attr('value') !== '') {
      output.push({
        name: $(this).text(),
        path: $(this).attr('value').substring(0, $(this).attr('value').indexOf('.'))
      })
    }
  })
  return output
}
let parseYears = function ($) {
  let output = []
  $('select').each(function (i, select) {
    if ($(this).attr('name') === 'ay') {
      $(this).children().each(function (j, option) {
        output.push($(this).text())
      })
    }
  })
  return output
}
let parseDestinations = function ($) {
  let output = []
  $('select').each(function (i, select) {
    if ($(this).attr('name') === 'oia') {
      $(this).children().each(function (j, option) {
        if ($(this).attr('value')) {
          output.push({
            name: $(this).text().substring(21).trim(),
            path: $(this).attr('value').match('oia=(.*)&')[1]
          })
        }
      })
    }
  })
  return output
}
let parseMajors = function ($) {
  let output = []
  $('select').each(function (i, select) {
    if ($(this).attr('name') === 'dora') {
      $(this).children().each(function (j, option) {
        if ($(this).attr('value') && $(this).attr('value') !== '-1') {
          output.push({
            name: $(this).text().trim(),
            path: $(this).attr('value')
          })
        }
      })
    }
  })
  return output
}

let getOrigins = function (callback) {
  let url = 'http://www.assist.org/web-assist/welcome.html'
  request(url, function ($) {
    callback(parseOrigins($))
  })
}
let getDestinationsAndYears = function (origin, callback) {
  let url = 'http://www.assist.org/web-assist/' + origin + '.html'
  request(url, function ($) {
    callback({ destinations: parseDestinations($), years: parseYears($) })
  })
}
let getMajors = function (origin, destination, year, callback) {
  let url = 'http://web2.assist.org/web-assist/articulationAgreement.do?inst1=none&inst2=none' + '&ia=' + origin + '&ay=' + year + '&oia=' + destination + '&dir=1'
  request(url, function ($) {
    callback(parseMajors($))
  })
}
let getAgreement = function (origin, destination, year, major, callback) {
  let url = 'http://web2.assist.org/cgi-bin/REPORT_2/Rep2.pl?' +
    'aay=' + year +
    '&dora=' + major +
    '&oia=' + destination +
    '&ay=' + year +
    '&event=19' +
    '&ria=' + destination +
    '&agreement=aa' +
    '&sia=' + origin +
    '&ia=' + origin +
    '&dir=1&&sidebar=false&rinst=left&mver=2&kind=5&dt=2'
  request(url, function ($) {
    callback($('body').text())
  })
}

module.exports = {
  getOrigins: getOrigins,
  getDestinationsAndYears: getDestinationsAndYears,
  getMajors: getMajors,
  getAgreement: getAgreement
}
