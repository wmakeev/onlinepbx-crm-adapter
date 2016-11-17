const crmAdapterActions = require('onlinepbx-crm-adapter-actions')

const actions = Object.assign({}, crmAdapterActions, {
  GET_CALLER_NAME: 'GET_CALLER_NAME'
})

const getCallerNameAction = callerNumber => ({
  type: actions.GET_CALLER_NAME,
  payload: {
    callerNumber
  }
})

module.exports = Object.assign({}, actions, {
  getCallerNameAction
})
