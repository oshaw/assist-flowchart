'use strict'

module.exports = function (url, callback) {
  const request = require('request')
  const cheerio = require('cheerio')
  request(url, function (err, res, body) {
    if (err) throw err
    if (res.statusCode === 200) callback(cheerio.load(body))
  })
}
