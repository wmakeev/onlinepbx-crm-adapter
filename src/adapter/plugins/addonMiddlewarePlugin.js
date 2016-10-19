'use strict'

/**
 * Плагин добавляет в ядро метод для обработки входящего запроса от AddonAPI
 * @param {Object} core ядро
 * @returns {Object} ядро
 */
module.exports = function addonMiddlewarePlugin (core) {
  let { log } = core

  let addonMiddleware = (req, res, next) => {
    let body = req.body
    if (!body) {
      return next(new Error('Empty request body'))
    }

    log('ADDON ACTION BODY:', body)

    /** @type {string} Команда */
    let action = body.action
    if (!action) {
      return next(new Error('Addon action not specified'))
    }

    core.dispatch({
      type: `addon/${action}`,
      payload: body
    })
      .then(data => {
        let responseData = {
          status: '1',
          comment: 'Запрос успешно выполнен',
          data
        }

        log(responseData.comment, responseData.data)

        return res.send(responseData)
      })
      .catch(err => next(err))
  }

  return Object.assign({}, core, { addonMiddleware })
}
