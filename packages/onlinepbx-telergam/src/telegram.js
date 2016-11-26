'use strict'

const nodeFetch = require('node-fetch')

const getEndpoint = (methodName, token) => `https://api.telegram.org/bot${token}/${methodName}`

class Telegram {
  constructor (options = {}) {
    this.TOKEN = options.token
    if (!this.TOKEN) {
      throw new Error('Bot token not specified')
    }
  }

  fetchResult (methodName, options = {}) {
    let requestOptions = {
      method: options.payload ? 'POST' : 'GET'
    }

    if (options.payload) {
      Object.assign(requestOptions, {
        body: JSON.stringify(options.payload),
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return nodeFetch(getEndpoint(methodName, this.TOKEN), requestOptions)
      .then(res => res.json())
      .then(res => {
        if (!res.ok) {
          throw new Error(`${res.description} (${res.error_code})`)
        }
        return res.result
      })
  }

  getMe () {
    return this.fetchResult('getMe')
  }

  getChat (chatId) {
    return this.fetchResult('getChat', {
      payload: { chat_id: chatId }
    })
  }

  sendMessage ({ chat_id, text, parse_mode, reply_markup }) {
    return this.fetchResult('sendMessage', {
      payload: {
        chat_id,
        text,
        parse_mode,
        reply_markup
      }
    })
  }
}

Telegram.ParseModes = {
  Markdown: 'Markdown',
  HTML: 'HTML'
}

module.exports = Telegram

