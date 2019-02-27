const Constants = require('../../constants')
const InvalidModuleConfigException = require('./exceptions/invalid-module-config.exception')
const deprecate = require('deprecate')

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

function showDeprecatedWarnings(moduleMetadata) {}
function overrideModuleMetadata(moduleMetadata) {
  moduleMetadata.modules = moduleMetadata.imports
    ? moduleMetadata.imports
    : moduleMetadata.modules
  moduleMetadata.components = moduleMetadata.providers
    ? moduleMetadata.providers
    : moduleMetadata.components
}

function Module(metadata) {
  const propsKeys = Object.keys(metadata)
  validateKeys(propsKeys)
  showDeprecatedWarnings(metadata)
  overrideModuleMetadata(metadata)

  return function(target) {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, metadata[property], target)
      }
    }
  }
}

module.exports = Module
