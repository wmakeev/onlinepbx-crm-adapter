'use strict'

/* eslint no-shadow: ["warn", { "allow": ["test", "t"] }] */

const test = require('blue-tape')
const co = require('co')

const search = require('../search')

test('Search', co.wrap(function * (t) {
  let result

  t.comment('"Центральный федеральный округ"')

  result = yield search('2222222', 'Центральный федеральный округ')
  t.deepEqual(result, {
    districts: {
      'Дальневосточный федеральный округ': 2,
      'Приволжский федеральный округ': 16,
      'Сибирский федеральный округ': 23,
      'Уральский федеральный округ': 18,
      'Южный федеральный округ': 1
    },
    phones: [
      { company: 'Спортпак', phone: '+7 (4742) 22-22-22', place: 'Липецкая область, Липецк' },
      { company: 'Двоечки', phone: '+7 (4912) 22-22-22', place: 'Рязанская область, Рязань' }
    ]
  }, 'search for: 2222222')

  result = yield search('+7 343 204-7535', 'Центральный федеральный округ')
  t.deepEqual(result, {
    districts: {},
    phones: [
      {
        company: 'FASHIONSET',
        phone: '+7 (343) 204-75-35',
        place: 'Свердловская область, Екатеринбург'
      },
      {
        company: 'Vensi',
        phone: '+7 (343) 204-75-35',
        place: 'Свердловская область, Екатеринбург'
      }
    ]
  }, 'search for: +7 343 2047535')
}))
