const RuntimeException = require('./runtime.exception')
const Messages = require('../messages')

class InvalidModuleException extends RuntimeException {
  constructor(trace) {
    const scope = (trace || []).map(module => module.name).join(' -> ')
    super(Messages.INVALID_MODULE_MESSAGE('', scope))
  }
}

module.exports = InvalidModuleException
