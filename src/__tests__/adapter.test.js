'use strict'

/* eslint no-shadow: ["warn", { "allow": ["test", "t"] }] */

const co = require('co')
const isObject = require('lodash.isobject')
const isPromise = require('is-promise')
const test = require('blue-tape')
// const { Core } = require('scaleflow')

let CrmAdapter = require('../')

// Mock CRM
const mockCrmMiddleware = require('./mocks/mockCrmMiddleware')

// Mock adapter creator
let MockCrmAdapter = CrmAdapter.middleware(mockCrmMiddleware)

// Test cases
const addonApiCases = require('./cases/addonApiCases')
const httpCommandCases = require('./cases/httpCommandCases')

// Tests
const testCases = (name, CurrentAdapter, adapterMethod, cases) => {
  test(name, t => {
    cases.forEach(curCase => {
      t.test(curCase.name, co.wrap(function * (t) {
        let core = CurrentAdapter()
        let result, error
        try {
          result = core[adapterMethod](curCase.data)
          t.ok(isPromise(result), 'result to be Promise')
          result = yield result
        } catch (e) {
          error = e
        }

        if (!error) {
          if (curCase.error) {
            t.fail(`Expected error "${curCase.error}" but have result`)
          }
          if (isObject(curCase.result)) {
            t.deepEqual(result, curCase.result, 'action result is equal')
          } else {
            t.equal(result, curCase.result, 'action result is equal')
          }
        } else {
          if (curCase.error) {
            t.equal(error.message, curCase.error,
              `error message is "${curCase.error}"`)
          } else {
            throw error
          }
        }
      }))
    })
  })
}

// Tests
test('Adapter API', co.wrap(function * (t) {
  let adapter = CrmAdapter()
  t.equal(typeof adapter.log, 'function',
    'adapter#log is function')
  t.equal(typeof adapter.addonAction,
    'function', 'adapter#addonAction is function')
  t.equal(typeof adapter.httpCommand, 'function',
    'adapter#httpCommand is function')
}))

testCases('Addon API middleware', MockCrmAdapter, 'addonAction', addonApiCases)

testCases('HTTP command middleware', MockCrmAdapter, 'httpCommand', httpCommandCases)
