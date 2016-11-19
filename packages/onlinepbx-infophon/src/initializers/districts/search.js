'use strict'

const { parsePhoneInfo, parseDistrictInfo } = require('./parsers')
const scrapers = require('./scrapers')

function search (phone, defaultDistrict) {
  let scraper = scrapers[defaultDistrict]
  if (!scraper) {
    throw new Error(`Unknown district "${defaultDistrict}"`)
  }

  return new Promise((resolve, reject) => {
    if (!phone) { throw new Error('phone not defined') }

    scraper(phone)
      .data(data => {
        try {
          resolve({
            phones: data.phones.map(parsePhoneInfo),
            districts: data.districts.reduce((res, district) => {
              let info = parseDistrictInfo(district)
              res[info.name] = info.found
              return res
            }, {})
          })
        } catch (e) {
          reject(e)
        }
      })
      .error(msg => reject(new Error(msg)))
  })
}

module.exports = (phone, defaultDistrict) => search(phone, defaultDistrict)
  .then(res => {
    let districts = Object.keys(res.districts)
    if (res.phones.length === 0 && districts.length !== 0) {
      return search(phone, districts[0])
    } else {
      return res
    }
  })
