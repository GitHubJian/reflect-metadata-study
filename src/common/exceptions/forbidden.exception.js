const HttpException = require('./http.exception')
const CreateHttpExceptionBodyUtil = require('../utils/http-exception-body.util')
const HttpStatusEnum = require('../enums/http-status.enum')

class ForbiddenException extends HttpException {
  constructor(message, error = 'Forbidden') {
    super(
      CreateHttpExceptionBodyUtil(message, error, HttpStatusEnum.FORBIDDEN),
      HttpStatusEnum.FORBIDDEN
    )
  }
}

module.exports = ForbiddenException
