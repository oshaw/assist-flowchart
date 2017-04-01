'use strict'

const xhr = require('./xhr')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  let url = 'http://www.assist.org/web-assist/welcome.html'
  xhr(url, function ($) {
    res.send($('html > body').text())
  })
})

app.listen(3000)
