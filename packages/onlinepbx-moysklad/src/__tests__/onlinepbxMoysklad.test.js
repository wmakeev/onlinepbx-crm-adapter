'use strict'

const path = require('path')
const co = require('co')
const nock = require('nock')
const test = require('blue-tape')
// const sinon = require('sinon')

const { Core } = require('scaleflow')

const { onlinepbxMoysklad } = require('..')
const actions = require('../actions')

// Mock log
const loggerInitializer = (_, { instance }) => Object.assign(instance, { log () {} })

const getScope = () => nock('https://online.moysklad.ru')
    .get('/api/remap/1.1/entity/counterparty')

nock.emitter.on('no match', req => {
  console.log('no match:', req)
})

test('onlinepbx-moysklad', co.wrap(function * (t) {
  let scope
  let result
  let core = (Core.compose(onlinepbxMoysklad).init(loggerInitializer))()

  t.comment('find company by phone')

  scope = getScope()
    .query({
      expand: 'contactpersons',
      search: '8922 609-07-05'
    })
    .replyWithFile(200, path.resolve(__dirname, 'res/counterparty.json'))

  result = yield core.dispatch({
    type: actions.GET_CALLER_NAME,
    payload: {
      callerNumber: '8922 609-07-05'
    }
  })

  t.ok(result)
  t.deepEqual(result, {
    type: actions.CALLER_NAME,
    payload: {
      caller: {
        contact: {
          email: 'mvv@vensi.me',
          id: 'd04f8c38-a83f-4117-9802-e420dc53105a',
          title: 'Макеев Виталий Вячеславович (ФЛ) [4]',
          url: 'https://online.moysklad.ru/app/#company/view?id=' +
            'd04f8c38-a83f-4117-9802-e420dc53105a'
        }
      },
      phone: '8922 609-07-05'
    }
  })

  scope.done()

  t.comment('find contact in company by phone')

  scope = getScope()
    .query({
      expand: 'contactpersons',
      search: '3521782'
    })
    .replyWithFile(200, path.resolve(__dirname, 'res/counterparty.json'))

  result = yield core.dispatch({
    type: actions.GET_CALLER_NAME,
    payload: {
      callerNumber: '3521782'
    }
  })

  t.ok(result)
  t.deepEqual(result, {
    type: actions.CALLER_NAME,
    payload: {
      phone: '3521782',
      caller: {
        company: {
          email: 'mvv@vensi.me',
          id: 'd04f8c38-a83f-4117-9802-e420dc53105a',
          title: 'Макеев Виталий Вячеславович (ФЛ) [4]',
          url: 'https://online.moysklad.ru/app/#company/view?' +
            'id=d04f8c38-a83f-4117-9802-e420dc53105a'
        },
        contact: {
          email: 'mvv@vensi.me',
          id: '4e36970d-1f92-4b76-8ab2-f995d029f729',
          name: 'Виталий',
          url: 'https://online.moysklad.ru/app/#company/view?' +
            'id=d04f8c38-a83f-4117-9802-e420dc53105a'
        }
      }
    }
  })

  scope.done()
}))
