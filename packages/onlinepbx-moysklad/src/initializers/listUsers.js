'use strict'

const mc = require('minico')
const nodeFetch = require('node-fetch')

const { getMoyskladError, getAuthHeader } = require('../tools')

const EMPLOYEE_URL = 'https://online.moysklad.ru/api/remap/1.1/entity/employee'

module.exports = function listUsersInitializer (options, { instance }) {
  if (!instance.moysklad) {
    instance.moysklad = {}
  }

  instance.moysklad.listUsers = mc(function * () {
    let employees = yield nodeFetch(EMPLOYEE_URL, {
      method: 'GET',
      headers: { Authorization: getAuthHeader() }
    })
      .then(res => res.json())
      .then(res => {
        // Обрабатываем возможную ошибку
        let error = getMoyskladError(res)
        return error
          ? Promise.reject(error)
          : res.rows
      })

    let employeesByNumber = employees.reduce((res, employee) => {
      let numberAttr = (employee.attributes || []).find(attr => {
        return attr.name === 'Внутренний номер' && attr.value
      })
      if (numberAttr) {
        res[numberAttr.value] = employee
      }
      return res
    }, {})

    let result = Object.keys(employeesByNumber).map(key => {
      let empl = employeesByNumber[key]
      return {
        id: empl.id,
        name: empl.name,
        phone: key
      }
    })

    return result
  })
}
