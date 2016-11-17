'use strict'

const { Core } = require('scaleflow')

const actionsRouter = require('./middlewares/actionsRouter')
const callerName = require('./middlewares/callerName')

module.exports = Core.middleware(actionsRouter, callerName)
