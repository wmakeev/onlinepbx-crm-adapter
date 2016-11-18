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

const callerNameAction = (phone, caller) => ({
  type: actions.CALLER_NAME,
  payload: {
    phone,
    caller
  }
})

module.exports = Object.assign({}, actions, {
  getCallerNameAction,
  callerNameAction
})
