const RuntimeException = require('./exceptions/runtime.exception')

class ExceptionHandler {
  handle(exception) {
    if (!(exception instanceof RuntimeException)) {
      ExceptionHandler.logger.error(exception.message, exception.stack)
      return
    }

    ExceptionHandler.logger.error(exception.what(), exception.stack)
  }
}

ExceptionHandler.logger = console

module.exports = ExceptionHandler
