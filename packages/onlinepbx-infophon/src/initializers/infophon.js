'use strict'

const infophonSearch = require('./districts/search')

module.exports = function infophonInitializer (options, { instance }) {
  const DEFAULT_DISTRICT = process.env.ONLINEPBX_INFOPHON_DEFAULT_DISTRICT ||
    'Центральный федеральный округ'

  let defaultDistrict = ((options || {}).infophon || {}).defaultDistrict || DEFAULT_DISTRICT
  instance.infophon = {
    search (phone, district) {
      return infophonSearch(phone, district || defaultDistrict)
    }
  }
}
