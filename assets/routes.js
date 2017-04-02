'use strict'

const path = require('path.join')
const xhr = require('../xhr')

let getMajors = function ($) {
  let output = []
  $('select').each(function (i, select) {
    console.log($(this).text())
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

module.exports = function (app) {
  app.get('/', function (req, res) {
    if (req.query.to) {
      if (req.query.major) {
        xhr(
          'http://web2.assist.org/cgi-bin/REPORT_2/Rep2.pl?' +
          'aay=' + req.query.year +
          '&dora=' + req.query.major +
          '&oia=' + req.query.to +
          '&ay=' + req.query.year +
          '&event=19' +
          '&ria=' + req.query.to +
          '&agreement=aa' +
          '&sia=' + req.query.from +
          '&ia=' + req.query.from +
          '&dir=1&&sidebar=false&rinst=left&mver=2&kind=5&dt=2'
          , function ($) {
          console.log($('body').text())
        })
      } else {
        xhr('http://web2.assist.org/web-assist/articulationAgreement.do?inst1=none&inst2=none' + '&ia=' + req.query.from + '&ay=' + req.query.year + '&oia=' + req.query.to + '&dir=1', function ($) {
          res.send(getMajors($))
        })
      }
    } else res.render(path(__dirname, 'index.jade'))
  })
}
