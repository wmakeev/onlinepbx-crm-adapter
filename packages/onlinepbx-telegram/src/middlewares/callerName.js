'use strict'

const { CALLER_NAME } = require('onlinepbx-crm-adapter-actions')

module.exports = core => next => action => {
  if (action.type === CALLER_NAME) {
    if (core.telegram.broadcast) {
      core.telegram.broadcast(action.payload)
        .catch(err => core.log(`onlinepbx-telegram: ${err.message}`))
    } else {
      core.log('onlinepbx-telegram not initialized')
    }
  }
  return next(action)
}

