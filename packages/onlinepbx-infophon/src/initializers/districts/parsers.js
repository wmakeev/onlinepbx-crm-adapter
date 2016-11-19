'use strict'

// https://regex101.com/r/eeCvRl/3
const phoneRegex = /^([\+0-9\s\(\)-]+)\s—\s(.+)\n(.+)$/

// https://regex101.com/r/QKRWJS/1
const districtRegex = /^(.+)\s\((\d+)\)$/

function parsePhoneInfo (info) {
  let match = phoneRegex.exec(info)
  if (!match || match.length !== 4) {
    throw new Error(`Can't parse phone info: "${info}"`)
  }
  return {
    phone: match[1].trim(),
    company: match[2].trim(),
    place: match[3].trim()
  }
}

function parseDistrictInfo (info) {
  let match = districtRegex.exec(info)
  if (!match || match.length !== 3) {
    throw new Error(`Can't parse district info: "${info}"`)
  }
  return {
    name: match[1].trim(),
    found: Number(match[2])
  }
}

module.exports = { parsePhoneInfo, parseDistrictInfo }
