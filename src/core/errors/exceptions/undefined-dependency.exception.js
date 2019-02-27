const Messages = require('../messages')
const RuntimeException = require('./runtime.exception')
class UndefinedDependencyException extends RuntimeException {
  constructor(type, undefinedDependencyContext, module) {
    super(
      Messages.UNKNOWN_DEPENDENCIES_MESSAGE(
        type,
        undefinedDependencyContext,
        module
      )
    )
  }
}

module.exports = UndefinedDependencyException
