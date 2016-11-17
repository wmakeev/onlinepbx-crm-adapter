'use strict'

const { CONTACT_INFO, HTTP_ACTION, getCallerNameAction } = require('../actions')

module.exports = core => next => action => {
  switch (action.type) {
    case CONTACT_INFO:
      return core.dispatch(getCallerNameAction(action.payload.phone))

    case HTTP_ACTION:
      return core.dispatch(getCallerNameAction(action.payload.caller_number))

    default:
      return next(action)
  }
}
