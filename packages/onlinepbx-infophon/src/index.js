'use strict'

const { Core } = require('scaleflow')

const infophon = require('./initializers/infophon')
const callerName = require('./middlewares/callerName')

module.exports = Core
  .init(infophon)
  .middleware(callerName)
