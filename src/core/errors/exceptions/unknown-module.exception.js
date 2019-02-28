const RuntimeException = require('./runtime.exception')
class UnknownModuleException extends RuntimeException {
  constructor() {
    super(
      'Nest cannot select given module (it does not exist in current context)'
    )
  }
}
module.exports = UnknownModuleException
