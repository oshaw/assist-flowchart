'use strict'

const xhr = require('../xhr')

let getOrigins = function ($) {
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
let getYears = function ($) {
  let output = []
  $('select').each(function (i, select) {
    if ($(this).attr('name') === 'ay') {
      $(this).children().each(function (j, option) {
        output.push($(this).text())
      })
      console.log(output)
    }
  })
  return output
}

module.exports = function (app) {
  app.get('/institutions.json', function (req, res) {
    let url = 'http://www.assist.org/web-assist/welcome.html'
    xhr(url, function ($) {
      res.send(getOrigins($))
    })
  })
  app.get('/institutions/:path.json', function (req, res) {
    let url = 'http://www.assist.org/web-assist/' + req.params.path + '.html'
    xhr(url, function ($) {
      res.send(getYears($))
    })
  })
}
