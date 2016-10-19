/**
 * server.js
 * Date: 16.08.14
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const serveStatic = require('serve-static')
const createAdapter = require('./adapter')


let server = express()
let adapter = createAdapter()

server.use(serveStatic(path.resolve(__dirname, '../public')))
server.use(favicon(path.resolve(__dirname, '../public/favicon.ico')))
server.use(bodyParser.urlencoded({ extended: true }))

server.post('/addon', adapter.addonMiddleware)
server.post('/http', adapter.httpCommandMiddleware)

server.use(function (err, req, res, next) {
  console.error(err.message)
  res.status(200).send({
    status: 0,
    comment: err.message
  })
})

server.listen(process.env.PORT || 5000)
