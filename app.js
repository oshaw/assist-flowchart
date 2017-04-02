'use strict'

const routes = require('./assets/routes')
const api = require('./assets/api')
const express = require('express')
const app = express()

routes(app)
api(app)

app.use(express.static('./assets'))
app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function () {
  console.log('uc-transfer on port', app.get('port'))
})
