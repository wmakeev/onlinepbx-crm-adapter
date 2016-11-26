'use strict'

const test = require('blue-tape')

const { formatPhone } = require('../tools')

test('Tools #formatPhone', t => {
  let phonesCases = {
    '12-3': '123',
    '123-456': '12-34-56',
    '123-4567': '123-45-67',
    '12345678': '1 234-56-78',
    '123456789': '12 345-67-89',
    '1234567890': '+7 (123) 456-78-90',
    '12345678901': '+1 (234) 567-89-01',
    '123456789012': '+12345 678-90-12'
  }

  Object.keys(phonesCases).forEach(key => {
    t.equal(formatPhone(key), phonesCases[key], `format phone: ${key}`)
  })

  t.end()
})
