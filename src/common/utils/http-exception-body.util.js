const SharedUtils = require('../utils/shared.utils')

function createHttpExceptionBody(message, error, statusCode) {
  if (!message) {
    return { statusCode, error }
  }

  return SharedUtils.isObject(message)
    ? message
    : { statusCode, error, message }
}

module.exports = createHttpExceptionBody
