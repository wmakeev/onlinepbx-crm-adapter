'use strict'

const co = require('co')
const assert = require('assert')
const nodeFetch = require('node-fetch')

const { GET_CALLER_NAME, callerNameAction } = require('../actions')

const { normalizePhone, getMoyskladError, getAuthHeader } = require('../tools')

const getSearchUrl = search =>
  'https://online.moysklad.ru/api/remap/1.1/entity/counterparty?expand=contactpersons&search=' +
    encodeURIComponent(search)

const getCompanyUrl = id => 'https://online.moysklad.ru/app/#company/view?id=' + id

module.exports = core => next => action => {
  if (action.type !== GET_CALLER_NAME) {
    return next(action)
  }

  // const { log } = core
  assert(typeof action.payload.callerNumber === 'string',
    'GET_CALLER_NAME action callerNumber must to be string')

  let phone = action.payload.callerNumber
  let normalizedPhone = normalizePhone(phone)

  return co(function * () {
    // TODO Выделить в отдельный модуль (или заменить библиотекой)
    let counterparties = yield nodeFetch(getSearchUrl(phone), {
      method: 'GET',
      headers: { Authorization: getAuthHeader() }
    }).then(res => res.json()).then(res => {
      // Обрабатываем возможную ошибку
      let error = getMoyskladError(res)
      return error
        ? Promise.reject(error)
        : res.rows
    })

    let testPhone = p => {
      if (!p) { return false }
      return p.split(/[;,]/g).map(normalizePhone).some(np => np === normalizedPhone)
    }

    let callerInfo = null

    for (let counterparty of counterparties) {
      if (counterparty.contactpersons) {
        let contacts = counterparty.contactpersons.rows.filter(c => testPhone(c.phone))
        if (contacts.length) {
          callerInfo = {
            contact: {
              id: contacts[0].id,
              url: getCompanyUrl(counterparty.id),
              name: contacts[0].name,
              email: contacts[0].email || counterparty.email
            },
            company: {
              id: counterparty.id,
              url: getCompanyUrl(counterparty.id),
              title: counterparty.name + (counterparty.code ? ` [${counterparty.code}]` : ''),
              email: counterparty.email
            }
          }
          break
        }
      }

      if (testPhone(counterparty.phone)) {
        callerInfo = {
          contact: {
            id: counterparty.id,
            url: getCompanyUrl(counterparty.id),
            title: counterparty.name + (counterparty.code ? ` [${counterparty.code}]` : ''),
            email: counterparty.email
          }
        }
        break
      }
    }

    return core.dispatch(callerNameAction(phone, callerInfo))
  })
}
