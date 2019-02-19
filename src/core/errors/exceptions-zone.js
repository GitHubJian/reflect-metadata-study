const ExceptionHandler = require('./exception-handler')
const Messages = require('./messages')

class ExceptionsZone {
  static run(fn) {
    try {
      fn()
    } catch (e) {
      this.exceptionHandler.handle(e)
      throw Messages.UNHANDLED_RUNTIME_EXCEPTION
    }
  }

  static async asyncRun(fn) {
    try {
      await fn()
    } catch (e) {
      this.exceptionHandler.handle(e)
      throw Messages.UNHANDLED_RUNTIME_EXCEPTION
    }
  }
}

ExceptionsZone.exceptionHandler = new ExceptionHandler()

module.exports = ExceptionsZone
