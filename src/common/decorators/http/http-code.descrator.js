const Constants = require('../../utils')

function HttpCode(statusCode) {
  return function(target, key, descriptor) {
    Reflect.defineMetadata(
      Constants.HTTP_CODE_METADATA,
      statusCode,
      descriptor.value
    )

    return descriptor
  }
}

module.exports = HttpCode
