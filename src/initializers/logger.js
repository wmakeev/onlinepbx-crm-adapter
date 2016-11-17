'use strict'

const debug = require('debug')

const loggerInitializer = name => (_, { instance }) => {
  const log = debug(name)
  return Object.assign(instance, { log })
}

module.exports = loggerInitializer
