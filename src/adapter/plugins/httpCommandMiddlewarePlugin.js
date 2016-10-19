'use strict'

const actions = require('../actions')

/**
 * Плагин добавляет в ядро метод для обработки входящего запроса от AddonAPI
 * @param {Object} core ядро
 * @returns {Object} ядро
 */
module.exports = function httpCommandMiddlewarePlugin (core) {
  let { log } = core

  let httpCommandMiddleware = (req, res, next) => {
    let body = req.body
    if (!body) {
      return next(new Error('Empty request body'))
    }

    log('HTTP ACTION BODY:', body)

    core.dispatch({
      type: actions.GET_CALLER_NAME,
      payload: {
        callerNumber: body.caller_number
      }
    })
      .then(name => {
        let response = `set_name: "${name}"`
        return res.send(response)
      })
      .catch(err => next(err))
  }

  return Object.assign({}, core, { httpCommandMiddleware })
}
