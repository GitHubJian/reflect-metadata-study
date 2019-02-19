const LoggerService = require('../../common/services/logger.service')
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

ExceptionHandler.logger = new LoggerService(ExceptionHandler.name)

module.exports = ExceptionHandler
