'use strict'

/* eslint no-shadow: ["warn", { "allow": ["test", "t"] }] */

const test = require('blue-tape')
const co = require('co')
const { CALLER_NAME } = require('onlinepbx-crm-adapter-actions')

let InfophonCore = require('..')

test('Extension onlinepbx-infophon', co.wrap(function * (t) {
  let result
  let action

  InfophonCore = InfophonCore.init((_, { instance }) => {
    instance.log = (msg) => t.equal(msg, 'foo')
  })

  let infophoneCore = InfophonCore({
    infophone: {
      defaultDistrict: 'Уральский федеральный округ'
    }
  })

  action = {
    type: CALLER_NAME,
    payload: {
      phone: '100'
    }
  }
  result = infophoneCore.dispatch(action)
  t.equal(result, action, 'not handle short phone numbers')

  action = {
    type: CALLER_NAME,
    payload: {
      phone: 'abc-100-dfg'
    }
  }
  result = infophoneCore.dispatch(action)
  t.equal(result, action, 'not handle short phone numbers')

  action = {
    type: CALLER_NAME,
    payload: {
      phone: '89001000000',
      caller: {}
    }
  }
  result = infophoneCore.dispatch(action)
  t.equal(result, action, 'not handle action with defined payload.caller field')

  action = {
    type: CALLER_NAME,
    payload: {
      phone: '9991234455',
      caller: null
    }
  }
  result = yield infophoneCore.dispatch(action)
  t.deepEqual(result, action, 'return action if phone not found')

  action = {
    type: CALLER_NAME,
    payload: {
      phone: '3432047535',
      caller: null
    }
  }
  result = yield infophoneCore.dispatch(action)
  t.notEqual(result, action, 'not mutate action')
  t.deepEqual(result, {
    type: 'CALLER_NAME',
    payload: {
      caller: {
        contact: {
          id: 'onlinepbx-infophon',
          name: 'FASHIONSET (Свердловская область, Екатеринбург)',
          photo: 'http://infophon.ru/images/trubka_top.jpg',
          url: 'https://yandex.ru/search/?text=FASHIONSET%20%D0%A1%D0%B2%D0%B5%D1%80%D0%B4%D0' +
          '%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C' +
          '%2C%20%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3'
        }
      },
      phone: '3432047535'
    }
  }, 'search for phone: 3432047535')
}))
