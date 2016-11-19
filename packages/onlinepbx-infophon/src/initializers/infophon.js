'use strict'

const infophonSearch = require('./districts/search')

const DEFAULT_DISTRICT = process.env.INFOPHON_DEFAULT_DISTRICT || 'Центральный федеральный округ'

module.exports = function infophonInitializer (options, { instance }) {
  let defaultDistrict = (options.infophon || {}).defaultDistrict || DEFAULT_DISTRICT
  instance.infophon = {
    search (phone, district) {
      return infophonSearch(phone, district || defaultDistrict)
    }
  }
}
