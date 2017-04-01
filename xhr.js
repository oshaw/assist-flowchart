'use strict'

let xhr = function (url, callback) {
  let request = require('request')
  let cheerio = require('cheerio')
  request(url, function (err, res, body) {
    if (err) throw err
    if (res.statusCode === 200) callback(cheerio.load(body))
  })
}

module.exports = xhr
