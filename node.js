'use strict'
const express = require('express')
const app = express()
const server = require('./server/server.js')

app.use(express.static('./client'))

server(app, __dirname)

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'))
