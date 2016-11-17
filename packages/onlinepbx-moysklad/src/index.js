'use strict'

const { Core } = require('scaleflow')

const callerNameMiddleware = require('./middlewares/callerNameMiddleware')

module.exports = {
  callerNameMiddleware,
  onlinepbxMoysklad: Core.middleware(callerNameMiddleware)
}
