'use strict'

const { Core } = require('scaleflow')

// Общие плагины и middleware
const getLoggerInitializer =
  require('./initializers/logger')

const getAddonActionInitializer =
  require('./initializers/addonAction')

const getHttpCommandInitializer =
  require('./initializers/httpCommand')

const getActionSchemaValidationMiddleware =
  require('./middlewares/actionSchemaValidation')

let Adapter = Core
  .init(
    getLoggerInitializer('onlinepbx-crm-adapter'),
    getAddonActionInitializer(),
    getHttpCommandInitializer())
  .middleware(getActionSchemaValidationMiddleware())

module.exports = Adapter
