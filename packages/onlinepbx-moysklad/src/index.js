'use strict'

const { Core } = require('scaleflow')

const actionsRouter = require('./middlewares/actionsRouter')
const callerName = require('./middlewares/callerName')

module.exports = {
  callerName,
  actionsRouter,
  onlinepbxMoysklad: Core.middleware(actionsRouter, callerName)
}
