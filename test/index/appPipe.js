const Injectable = require('../../src/common/decorators/core/injectable.decorator')

class BadRequestException extends Error {
  constructor(msg) {
    super(msg)
    this.msg = msg
  }

  what() {
    return this.msg
  }
}

@Injectable()
class AppPipe {
  transform(value, metadata) {
    if (value !== 2) {
      throw new BadRequestException('Validation failed')
    }

    return value
  }
}

module.exports = AppPipe
