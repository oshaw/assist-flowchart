'use strict'

const routes = require('./assets/routes')
const api = require('./assets/api')
const express = require('express')
const app = express()

app.set('view engine', 'jade')
app.use(express.static('./assets'))
app.set('port', (process.env.PORT || 5000))

routes(app)
api(app)

app.listen(app.get('port'), function () {
  console.log('uc-transfer on port', app.get('port'))
})
