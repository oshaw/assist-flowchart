'use strict';
const cheerio = require('cheerio');
const request = require('request');

const ATTEMPTS = 10;
const TIMEOUT = 3000;

module.exports = function (url, callback, attempt = 1) {
  request(url, function (err, res, body) {
    if (err) {
      if (err.code === "ETIMEDOUT" && attempt <= ATTEMPTS) {
        setTimeout(function () {
          module.exports(url, callback, attempt + 1);
        }, TIMEOUT);
      }
      else {
        throw err;
      }
    }
    else if (res.statusCode === 200) {
      callback(cheerio.load(body));
    }
  });
}
