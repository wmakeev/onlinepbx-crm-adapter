'use strict'

const {
  CONTACT_INFO, HTTP_ACTION, LIST_USERS, CALLER_NAME
} = require('onlinepbx-crm-adapter-actions')

const getCaller = (core, phone) =>
  core.moysklad.getCallerName(phone)
    .then(caller => core.dispatch({
      type: CALLER_NAME,
      payload: {
        phone, caller
      }
    }))
    .then(callerNameAction => callerNameAction.payload.caller)

module.exports = core => next => action => {
  switch (action.type) {
    case CONTACT_INFO:
      return getCaller(core, action.payload.phone)

    case HTTP_ACTION:
      return getCaller(core, action.payload.caller_number)
        .then(caller => {
          if (!caller) { return null }
          let name = caller.company ? caller.company.title : caller.contact.name
          return `set_name: "${name}"`
        })

    case LIST_USERS:
      return core.moysklad.listUsers()

    default:
      return next(action)
  }
}
