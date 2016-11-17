try {
  require('dotenv').config({ silent: true })
} catch (e) {}

module.exports = require('./src')
