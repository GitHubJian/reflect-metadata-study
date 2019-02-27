const Constants = require('./constants')

class InvalidModuleConfigException extends Error {
  constructor(property) {
    super(Constants.InvalidModuleConfigMessage(property))
  }
}

module.exports = InvalidModuleConfigException
