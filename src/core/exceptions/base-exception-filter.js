const HttpException = require('../../common/exceptions/http.exception')
const HttpStatusEnum = require('../../common/enums/http-status.enum')
const Constants = require('../constants')
const SharedUtils = require('../../common/utils/shared.utils')
const LoggerService = require('../../common/services/logger.service')
const ImplementException = require('../../common/exceptions/implement.exception')

class BaseExceptionFilter {
  constructor(applicationRef) {
    this.applicationRef = applicationRef
  }

  catch(exception, host) {
    const applicationRef =
      this.applicationRef ||
      (this.applicationRefHost && this.applicationRefHost.applicationRef)

    if (exception instanceof ImplementException) {
      const body = {
        statusCode: HttpStatusEnum.INTERNAL_SERVER_ERROR,
        message: exception.message
      }

      applicationRef.reply(host.getArgs(), body, body.statusCode)

      return
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse()
      const message = SharedUtils.isObject(res)
        ? res
        : {
            statusCode: exception.getStatus(),
            message: res
          }

      applicationRef.reply(host.getArgs(), message, exception.getStatus())

      return
    } else {
      const body = {
        statusCode: HttpStatusEnum.INTERNAL_SERVER_ERROR,
        message: Constants.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE
      }

      applicationRef.reply(host.getArgs(), body, body.statusCode)

      if (this.isExceptionObject(exception)) {
        return BaseExceptionFilter.logger.error(
          exception.message,
          exception.stack
        )
      }

      return BaseExceptionFilter.logger.error(exception)
    }
  }

  isExceptionObject(err) {
    return SharedUtils.isObject(err) && !!err.message
  }
}

BaseExceptionFilter.logger = new LoggerService('ExceptionsHandler')

module.exports = BaseExceptionFilter
