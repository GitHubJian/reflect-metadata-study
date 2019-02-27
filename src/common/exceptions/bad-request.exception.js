const HttpException = require('./http.exception')
const HttpExceptionBodyUtils = require('../utils/http-exception-body.util')
const HttpStatusEnum = require('../enums/http-status.enum')

class BadRequestException extends HttpException {
  constructor(message, error = 'Bad Request') {
    super(
      HttpExceptionBodyUtils(message, error, HttpStatusEnum.BAD_REQUEST),
      HttpStatusEnum.BAD_REQUEST
    )
  }
}

module.exports = BadRequestException
