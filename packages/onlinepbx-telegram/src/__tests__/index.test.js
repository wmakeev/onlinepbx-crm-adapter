'use strict'

const co = require('co')
const test = require('blue-tape')
const { Core } = require('scaleflow')
const { CALLER_NAME } = require('onlinepbx-crm-adapter-actions')

const OnlinepbxTelegram = require('..')
const nocks = require('./telegram/nocks')
const cases = require('./res/index-cases')

const loggerInitializer = (_, { instance }) => {
  instance.log = (...args) => console.log(...args)
}

let FAKE_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'

test('OnlinepbxTelegram', co.wrap(function * (t) {
  let { shouldGetOk, shouldPostOk, isDone } = nocks(FAKE_TOKEN)

  shouldGetOk({
    apiMethod: 'getMe',
    result: {
      id: 123456,
      first_name: 'onlinepbx_bot',
      username: 'onlinepbx_bot'
    }
  })

  shouldPostOk({
    apiMethod: 'getChat',
    payload: { chat_id: '@onlinepbx' },
    result: {
      id: -56789,
      title: 'OnlinePBX',
      username: 'onlinepbx',
      type: 'channel'
    }
  })

  let onlinepbxTelegram = yield Core.init(loggerInitializer).compose(OnlinepbxTelegram).create({
    telegram: {
      token: FAKE_TOKEN,
      channelName: 'onlinepbx'
    }
  })

  t.ok(isDone(), 'initial request is done')

  cases.forEach(caseItem => {
    t.test(caseItem.name, t => {
      shouldPostOk({
        apiMethod: 'sendMessage',
        payload: caseItem.sendMessagePayload,
        result: { no: 'matter' }
      })

      let action = {
        type: CALLER_NAME,
        payload: caseItem.actionPayload
      }

      t.equal(action, onlinepbxTelegram.dispatch(action), 'action pass through')

      setTimeout(() => {
        t.ok(isDone(), 'full caller request is done')
        t.end()
      }, 1)
    })
  })
}))
