'use strict'

const mc = require('minico')
const translit = require('translitit-cyrillic-russian-to-latin')
const {
  CONTACT_INFO, HTTP_ACTION, LIST_USERS, CALLER_NAME, GET_CALLER_NAME
} = require('onlinepbx-crm-adapter-actions')

module.exports = core => {
  const getCaller = mc(function * (phone) {
    let result = yield core.dispatch({
      type: GET_CALLER_NAME,
      payload: { phone }
    })
    return (result.type === CALLER_NAME) ? result.payload.caller : null
  })

  return next => action => {
    switch (action.type) {
      case GET_CALLER_NAME:
        let { phone } = action.payload
        return core.moysklad.getCallerName(phone)
          .then(caller => {
            if (caller) {
              return core.dispatch({
                type: CALLER_NAME,
                payload: {
                  phone, caller
                }
              })
            } else {
              return next(action)
            }
          })
          .catch(err => {
            core.log(err)
            return next(action)
          })

      case CONTACT_INFO:
        return getCaller(action.payload.phone)

      case HTTP_ACTION:
        switch (action.payload.action) {
          case 'set_name':
            return getCaller(action.payload.caller_number).then(caller => {
              let name = caller
                ? caller.company ? caller.company.title : caller.contact.name
                : action.payload.caller_name || 'Unknown'

              if (core.options.translitHttpSetNameCommand) {
                name = translit(name).replace(/[^a-zA-Z0-9\s]+/g, '')
              }

              return `set_name: "${name}"`
            })

          default:
            return Promise.reject(new Error('Http command action not specified'))
        }

      case LIST_USERS:
        return core.moysklad.listUsers()

      default:
        return next(action)
    }
  }
}
