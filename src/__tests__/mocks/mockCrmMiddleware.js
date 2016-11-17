'use strict'

const actions = require('onlinepbx-crm-adapter-actions')

module.exports = function mockCrmMiddleware (core) {
  return next => action => {
    let nextAction = next(action)
    if (nextAction.type in actions) {
      return nextAction.type === actions.HTTP_ACTION
        ? Promise.resolve('httpCommandName: someAction')
        : Promise.resolve({ crmResult: true })
    } else {
      return nextAction
    }
  }
}

