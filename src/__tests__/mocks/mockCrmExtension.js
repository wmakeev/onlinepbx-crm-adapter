'use strict'

const { Core } = require('scaleflow')
const actions = require('onlinepbx-crm-adapter-actions')

const mockCrmMiddleware = core => next => action => {
  let nextAction = next(action)
  if (nextAction.type in actions) {
    return nextAction.type === actions.HTTP_ACTION
      ? Promise.resolve('httpCommandName: someAction')
      : Promise.resolve({ crmResult: true })
  } else {
    return nextAction
  }
}

module.exports = Core.middleware(mockCrmMiddleware)

