const Injectable = require('../../src/common/decorators/core/injectable.decorator')
const PipeTransformImplement = require('../../src/common/implements/pipe-transform.implement')

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
class AppPipe extends PipeTransformImplement {
  transform(value, metadata) {
    return value + 'abc'
  }
}

module.exports = AppPipe
