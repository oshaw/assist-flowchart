'use strict'

const xhr = require('../xhr')

let parseInstitutions = function ($) {
  let output = []
  $('option').each(function (i, option) {
    if ($(this).attr('value') !== '') {
      output.push({name: $(this).text(), path: $(this).attr('value')})
    }
  })
  return output
}

module.exports = function (app) {
  app.get('/institutions.json', function (req, res) {
    let url = 'http://www.assist.org/web-assist/welcome.html'
    xhr(url, function ($) {
      res.send(parseInstitutions($))
    })
  })
}
