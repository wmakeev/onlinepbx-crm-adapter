'use strict'

const phoneParser = require('phone-parser')

const phoneFormats = []
phoneFormats[6] = 'xx-xx-xx'
phoneFormats[7] = 'xxx-xx-xx'
phoneFormats[8] = 'x xxx-xx-xx'
phoneFormats[9] = 'xx xxx-xx-xx'
phoneFormats[10] = '+7 (xxx) xxx-xx-xx'
phoneFormats[11] = '+x (xxx) xxx-xx-xx'
phoneFormats[12] = '+xxxxx xxx-xx-xx'

module.exports = {
  // TODO +8 (может быть такое?)
  formatPhone (phone) {
    if (!phone) { return null }
    let numPhone = phone.replace(/\D/g, '')
    if (numPhone.length < 13 && numPhone.length > 5) {
      return phoneParser(numPhone, phoneFormats[numPhone.length])
    } else {
      return numPhone
    }
  }
}
