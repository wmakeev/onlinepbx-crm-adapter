'use strict'

const { Core } = require('scaleflow')

const actionsRouter = require('./middlewares/actionsRouter')
const callerName = require('./middlewares/callerName')
const listUsers = require('./middlewares/listUsers')

module.exports = Core.middleware(actionsRouter, callerName, listUsers)
