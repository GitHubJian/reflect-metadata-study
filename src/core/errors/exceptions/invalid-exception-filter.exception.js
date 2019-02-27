const RuntimeException = require('./runtime.exception')
const Messages = require('../messages')

class InvalidExceptionFilterException extends RuntimeException {
  constructor() {
    super(Messages.INVALID_EXCEPTION_FILTER)
  }
}

module.exports = InvalidExceptionFilterException
