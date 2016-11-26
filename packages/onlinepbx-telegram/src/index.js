'use strict'

const { Core } = require('scaleflow')

const broadcast = require('./initializers/broadcast')
const callerName = require('./middlewares/callerName')

module.exports = Core
  .init(broadcast)
  .middleware(callerName)
