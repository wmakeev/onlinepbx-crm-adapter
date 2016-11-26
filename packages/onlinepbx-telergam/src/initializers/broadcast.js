'use strict'

const co = require('co')

const Telegram = require('../telegram')
const { formatPhone } = require('../tools')

const getCallerMessage = ({ phone, caller }) => {
  let companyName = (caller.company || {}).title
  let contactName = caller.contact.name
  let email = caller.contact.email || (caller.company || {}).email

  return [
    `<b>${companyName || contactName}</b>`,
    (companyName && companyName.indexOf(contactName) === -1) ? contactName : null,
    formatPhone(phone),
    email
  ].filter(item => item).join('\n')
}

const getUnknownMessage = ({ phone }) => `<b>Не определен</b>\n${formatPhone(phone)}`

module.exports = function broadcastInitializer (options = {}, { instance }) {
  let { log } = instance

  if (!instance.telegram) {
    instance.telegram = {}
  }

  const logError = err => log(`onlinepbx-telergam:`, err)

  let telegram
  try {
    telegram = new Telegram({
      token: process.env.ONLINEPBX_TELEGRAM_BOT_TOKEN || (options.telegram || {}).token
    })
  } catch (err) {
    logError(err)
    return
  }

  return co(function * () {
    let bot = yield telegram.getMe()

    let channelName = process.env.ONLINEPBX_TELEGRAM_CHANNEL_NAME ||
      (options.telegram || {}).channelName

    if (!channelName) {
      throw new Error('Telegram channel not specified')
    }

    let chat = yield telegram.getChat('@' + channelName)

    log('onlinepbx-telergam: connected to channel ' +
      `"${chat.title}" through "${bot.first_name}" bot`)

    instance.telegram.broadcast = co.wrap(function * (callerInfo) {
      let message = {
        chat_id: chat.id,
        parse_mode: 'HTML'
      }

      if (callerInfo.caller) {
        message.text = getCallerMessage(callerInfo)
        if (callerInfo.caller.contact.url) {
          message.reply_markup = {
            inline_keyboard: [[
              {
                text: 'Карточка клиента',
                url: callerInfo.caller.contact.url
              }
            ]]
          }
        }
      } else {
        message.text = getUnknownMessage(callerInfo)
      }

      return telegram.sendMessage(message)
    })
  })
}
