const HttpException = require('./http.exception')
const HttpStatusEnum = require('../enums/http-status.enum')
const CreateHttpExceptionBodyUtil = require('../utils/http-exception-body.util')

class NotFoundException extends HttpException {
  constructor(message, error = 'Not Found') {
    super(
      CreateHttpExceptionBodyUtil(message, error, HttpStatusEnum.NOT_FOUND),
      HttpStatusEnum.NOT_FOUND
    )
  }
}

module.exports = NotFoundException
