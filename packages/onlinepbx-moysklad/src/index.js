'use strict'

const { Core } = require('scaleflow')

const listUsers = require('./initializers/listUsers')
const getCallerName = require('./initializers/getCallerName')
const actionsHandler = require('./middlewares/actionsHandler')

module.exports = Core
  .init(getCallerName, listUsers)
  .middleware(actionsHandler)
