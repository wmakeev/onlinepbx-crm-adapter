'use strict'

const actions = require('onlinepbx-crm-adapter-actions')

/**
 * Добавляет метод для обработки входящего запроса от модуля http-запроса
 * @param {Object} options опции
 * @returns {function} instance initializer
 */
const httpCommandInitializer = options => (_, { instance }) => {
  const { log } = instance

  const httpCommand = actionData => {
    if (!actionData) {
      return Promise.reject(new Error('Empty http command'))
    }

    log('HTTP ACTION:', actionData)

    return instance.dispatch({
      type: actions.HTTP_ACTION,
      payload: actionData
    })
  }

  return Object.assign(instance, { httpCommand })
}

module.exports = httpCommandInitializer
