'use strict'

const mc = require('minico')
const nodeFetch = require('node-fetch')

const { normalizePhone, getMoyskladError, getAuthHeader } = require('../tools')

const getSearchUrl = search =>
  'https://online.moysklad.ru/api/remap/1.1/entity/counterparty?expand=contactpersons&search=' +
    encodeURIComponent(search)

const getCompanyUrl = id => 'https://online.moysklad.ru/app/#company/view?id=' + id

module.exports = function getCallerNameInitializer (options, { instance }) {
  if (!instance.moysklad) {
    instance.moysklad = {}
  }

  instance.moysklad.getCallerName = mc(function * (phone) {
    let normalizedPhone = normalizePhone(phone)

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

    let caller = null

    for (let counterparty of counterparties) {
      if (counterparty.contactpersons) {
        let contacts = counterparty.contactpersons.rows.filter(c => testPhone(c.phone))
        if (contacts.length) {
          caller = {
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
        caller = {
          contact: {
            id: counterparty.id,
            url: getCompanyUrl(counterparty.id),
            name: counterparty.name + (counterparty.code ? ` [${counterparty.code}]` : ''),
            email: counterparty.email
          }
        }
        break
      }
    }

    return caller
  })
}
