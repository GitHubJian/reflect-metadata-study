const HttpException = require('../../common/exceptions/http.exception')
const HttpStatusEnum = require('../../common/enums/http-status.enum')
const Constants = require('../../common/constants')
const SharedUtils = require('../../common/utils/shared.utils')
const LoggerService = require('../../common/services/logger.service')

class BaseExceptionFilter {
  constructor(applicationRef) {
    this.applicationRef = applicationRef
  }

  catch(exception, host) {
    const applicationRef =
      this.applicationRef ||
      (this.applicationRefHost && this.applicationRefHost.applicationRef)

    if (!(exception instanceof HttpException)) {
      const body = {
        statusCode: HttpStatusEnum.INTERNAL_SERVER_ERROR,
        message: Constants.MESSAGE.UNKNOWN_EXCEPTION_MESSAGE
      }

      applicationRef.reply(host.getArgByIndex(1), body, body.statusCode)
      if (this.isExceptionObject(exception)) {
        return BaseExceptionFilter.logger.error(
          exception.message,
          exception.stack
        )
      }

      return BaseExceptionFilter.logger.error(exception)
    }

    const res = exception.getResponse()
    const message = SharedUtils.isObject(res)
      ? res
      : {
          statusCode: exception.getStatus(),
          message: res
        }

    applicationRef.reply(host.getArgs(), message, exception.getStatus())
  }

  isExceptionObject(err) {
    return SharedUtils.isObject(err) && !!err.message
  }
}

BaseExceptionFilter.logger = new LoggerService('ExceptionsHandler')

module.exports = BaseExceptionFilter
