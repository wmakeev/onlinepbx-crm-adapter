'use strict'

const co = require('co')
const actions = require('onlinepbx-crm-adapter-actions')

/**
 * Добавляет метод для обработки входящего запроса от AddonAPI
 * @param {Object} options опции
 * @returns {function} instance initializer
 */
const addonActionInitializer = options => (_, { instance }) => {
  const { log } = instance

  const addonAction = co.wrap(function * (actionData) {
    if (!actionData) {
      return Promise.reject(new Error('Empty addon action'))
    }

    log('ADDON ACTION:', actionData)

    if (!actionData.action) {
      return Promise.reject(new Error('Addon action name not specified'))
    }

    let actionType
    switch (actionData.action) {
      case 'test':
        return Promise.resolve({ status: 1 })

      default:
        actionType = actions[actionData.action.toUpperCase()]
        if (!actionType) {
          return Promise.reject(new Error(`Unknown addon action "${actionData.action}"`))
        }
    }

    let action = {
      type: actionType
    }

    if (actionData.data) {
      action.payload = actionData.data
    }

    let data = yield instance.dispatch(action)

    let responseData = {
      status: '1',
      comment: 'Запрос успешно выполнен',
      data
    }

    log(responseData.comment + ':', responseData.data)

    return responseData
  })

  return Object.assign(instance, { addonAction })
}

module.exports = addonActionInitializer
