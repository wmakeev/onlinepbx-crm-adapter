'use strict'

const actionSchemaValidationMiddleware = options => core => next => action => {
  // TODO validate
  return next(action)
}

module.exports = actionSchemaValidationMiddleware
