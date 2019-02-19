const deprecate = require('deprecate')
const Constants = require('../../constants')
const InvalidModuleConfigException = require('./exceptions/invalid-module-config.exception')

const metadataKeys = [
  Constants.METADATA.MODULES,
  Constants.METADATA.IMPORTS,
  Constants.METADATA.EXPORTS,
  Constants.METADATA.COMPONENTS,
  Constants.METADATA.CONTROLLERS,
  Constants.METADATA.PROVIDERS
]

function validateKeys(keys) {
  const isKeyInvalid = key => metadataKeys.findIndex(k => k === key) < 0
  const validateKey = key => {
    if (!isKeyInvalid(key)) {
      return
    }

    throw new InvalidModuleConfigException(key)
  }
  keys.forEach(validateKey)
}

function showDeprecatedWarnings(moduleMetadata) {
  const MODULES_DEPRECATED_WARNING =
    'The "modules" key in the @Module() decorator is deprecated and will be removed within next major release. Use the "imports" key instead.'
  moduleMetadata.modules && deprecate(MODULES_DEPRECATED_WARNING)
}

function Module(metadata) {
  const propsKeys = Object.keys(metadata)
  validateKeys(propsKeys)
  showDeprecatedWarnings(metadata)

  return function(target) {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, metadata[property], target)
      }
    }
  }
}

module.exports = Module
