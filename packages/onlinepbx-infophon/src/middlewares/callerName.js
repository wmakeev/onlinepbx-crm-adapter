'use strict'

const { CALLER_NAME } = require('onlinepbx-crm-adapter-actions')

const PHOTO_URL = 'http://infophon.ru/images/trubka_top.jpg'
const getSearchEngineUrl = text => `https://yandex.ru/search/?text=${encodeURIComponent(text)}`

module.exports = core => next => action => {
  switch (true) {
    case action.type !== CALLER_NAME: // Обрабатываем только CALLER_NAME actions
    case !!action.payload.caller: // для которых payload.caller не null
    case action.payload.phone.replace(/\D/g, '').length < 10: // и телефон не меньше 10 цифр
      return next(action)
  }

  let { phone } = action.payload

  return core.infophon.search(phone)
    .then(result => {
      if (result.phones.length) {
        let phoneInfo = result.phones[0]
        let contact = {
          id: 'onlinepbx-infophon', // TODO Fake id!
          name: `${phoneInfo.company} (${phoneInfo.place})`,
          url: getSearchEngineUrl(`${phoneInfo.company} ${phoneInfo.place}`),
          photo: PHOTO_URL
        }
        return next({
          type: CALLER_NAME,
          payload: {
            phone, caller: { contact }
          }
        })
      } else {
        return next(action)
      }
    })
    .catch((err) => {
      core.log(`Ошибка поиска infophon: ${err.message}`)
      return next(action)
    })
}
