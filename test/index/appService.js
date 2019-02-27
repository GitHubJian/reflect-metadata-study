const Injectable = require('../../src/common/decorators/core/injectable.decorator')

@Injectable()
class AppService {
  getHello() {
    return 'Hello world1111!'
  }
}

module.exports = AppService
