'use strict'

const {
  applyMiddleware, applyPlugin, createCore, composeAsync: compose
} = require('scaleflow')

const addonActionRequestHandlerPlugin = require('./plugins/addonActionRequestHandlerPlugin')

module.exports = compose(
  applyPlugin(addonActionRequestHandlerPlugin),
  applyMiddleware()
)(createCore)
