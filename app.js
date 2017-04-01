'use strict'

const router = require('./assets/router')
const api = require('./assets/api')
const express = require('express')
const app = express()

router(app)
api(app)

app.use(express.static('./assets'))
app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function () {
  console.log('uc-transfer on port', app.get('port'))
})
