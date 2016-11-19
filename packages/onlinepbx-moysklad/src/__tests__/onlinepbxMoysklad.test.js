'use strict'

const path = require('path')
const co = require('co')
const nock = require('nock')
const test = require('blue-tape')
// const sinon = require('sinon')

const { Core } = require('scaleflow')

const onlinepbxMoysklad = require('..')
const { CONTACT_INFO, HTTP_ACTION, LIST_USERS } = require('onlinepbx-crm-adapter-actions')

// Mock log
const loggerInitializer = (_, { instance }) => Object.assign(instance, { log () {} })

const getScope = (type, query) => nock('https://online.moysklad.ru')
    .get(`/api/remap/1.1/entity/${type}`)
    .query(query)
    .replyWithFile(200, path.resolve(__dirname, `res/${type}.json`))

nock.emitter.on('no match', req => {
  console.log('no match:', req)
})

test('onlinepbx-moysklad', co.wrap(function * (t) {
  let scope
  let result
  let TestCore = Core.compose(onlinepbxMoysklad).init(loggerInitializer)
  let core = TestCore()

  // - //
  t.comment('CONTACT_INFO - company')
  scope = getScope('counterparty', { expand: 'contactpersons', search: '8922 609-07-05' })
  result = yield core.dispatch({
    type: CONTACT_INFO,
    payload: {
      phone: '8922 609-07-05'
    }
  })
  t.ok(result)
  t.deepEqual(result, {
    contact: {
      email: 'mvv@vensi.me',
      id: 'd04f8c38-a83f-4117-9802-e420dc531555',
      title: 'Макеев Виталий Вячеславович (ФЛ) [4]',
      url: 'https://online.moysklad.ru/app/#company/view?id=' +
        'd04f8c38-a83f-4117-9802-e420dc531555'
    }
  })
  scope.done()

  // - //
  t.comment('CONTACT_INFO - contact in company')
  scope = getScope('counterparty', { expand: 'contactpersons', search: '3521782' })
  result = yield core.dispatch({
    type: CONTACT_INFO,
    payload: {
      phone: '3521782'
    }
  })
  t.ok(result)
  t.deepEqual(result, {
    company: {
      email: 'mvv@vensi.me',
      id: 'd04f8c38-a83f-4117-9802-e420dc531555',
      title: 'Макеев Виталий Вячеславович (ФЛ) [4]',
      url: 'https://online.moysklad.ru/app/#company/view?' +
        'id=d04f8c38-a83f-4117-9802-e420dc531555'
    },
    contact: {
      email: 'mvv@vensi.me',
      id: '4e36970d-1f92-4b76-8ab2-f995d029f729',
      name: 'Виталий',
      url: 'https://online.moysklad.ru/app/#company/view?' +
        'id=d04f8c38-a83f-4117-9802-e420dc531555'
    }
  })
  scope.done()

  // - //
  t.comment('CONTACT_INFO - no result')
  scope = getScope('counterparty', { expand: 'contactpersons', search: '705' })
  result = yield core.dispatch({
    type: CONTACT_INFO,
    payload: {
      phone: '705'
    }
  })
  t.equal(result, null)
  scope.done()

  t.comment('LIST_USERS')
  scope = getScope('employee', {})
  result = yield core.dispatch({
    type: LIST_USERS
  })
  t.ok(result)
  t.deepEqual(result, [
    {
      id: '005323cb-83ac-11e6-7a31-d0fd002ef703',
      name: 'Игнатьева Т. М.',
      phone: '100'
    }
  ])
  scope.done()

  // - //
  t.comment('HTTP_ACTION - get contact name')
  scope = getScope('counterparty', { expand: 'contactpersons', search: '83433521782' })
  result = yield core.dispatch({
    type: HTTP_ACTION,
    payload: {
      caller_number: '83433521782'
    }
  })
  t.equal(result, 'set_name: "Макеев Виталий Вячеславович (ФЛ) [4]"')
  scope.done()

  // - //
  t.comment('HTTP_ACTION - no result')
  scope = getScope('counterparty', { expand: 'contactpersons', search: '456' })
  result = yield core.dispatch({
    type: HTTP_ACTION,
    payload: {
      caller_number: '456'
    }
  })
  t.equal(result, null)
  scope.done()
}))
