'use strict'

const co = require('co')
const test = require('blue-tape')
// const nock = require('nock')

const Telegram = require('../../telegram')
const nocks = require('./nocks')

let FAKE_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'

// const skip = () => {}

test('Telegram instance API', t => {
  t.throws(() => {
    return new Telegram()
  }, 'Bot token not specified')

  let telegram = new Telegram({ token: FAKE_TOKEN })

  t.ok(telegram.getMe, '#getMe')

  t.end()
})

test('Telegram #getMe', co.wrap(function * (t) {
  let telegram = new Telegram({ token: FAKE_TOKEN })
  let { shouldGetOk } = nocks(FAKE_TOKEN)

  let result = {
    id: 123456,
    first_name: 'onlinepbx_bot',
    username: 'onlinepbx_bot'
  }

  shouldGetOk({ apiMethod: 'getMe', result })
  let response = yield telegram.getMe()

  t.deepEqual(response, result)
}))

test('Telegram #getChat', co.wrap(function * (t) {
  let telegram = new Telegram({ token: FAKE_TOKEN })
  let { shouldPostOk } = nocks(FAKE_TOKEN)

  let result = {
    id: -123456,
    title: 'OnlinePBX',
    username: 'onlinepbx',
    type: 'channel'
  }

  shouldPostOk({
    apiMethod: 'getChat',
    payload: { chat_id: '@onlinepbx' },
    result
  })
  let response = yield telegram.getChat('@onlinepbx')

  t.deepEqual(response, result)
}))

test('Telegram #sendMessage', co.wrap(function * (t) {
  let telegram = new Telegram({ token: FAKE_TOKEN })
  let { shouldPostOk } = nocks(FAKE_TOKEN)

  let result = {
    message_id: 6,
    chat: {
      id: -123456,
      title: 'OnlinePBX',
      username: 'onlinepbx',
      type: 'channel'
    },
    date: 1479636766,
    text: 'Привет, это бот!',
    entities: [
      {
        type: 'bold',
        offset: 0,
        length: 6
      }
    ]
  }

  shouldPostOk({
    apiMethod: 'sendMessage',
    payload: {
      chat_id: -123456,
      text: '<b>Привет</b>, это бот!',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть карточку клиента',
              url: 'https://crm.ru/123'
            }
          ]
        ]
      }
    },
    result
  })

  let response = yield telegram.sendMessage({
    chat_id: -123456,
    text: '<b>Привет</b>, это бот!',
    parse_mode: Telegram.ParseModes.HTML,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть карточку клиента',
            url: 'https://crm.ru/123'
          }
        ]
      ]
    }
  })

  t.deepEqual(response, result)
}))

// nock.recorder.rec()
