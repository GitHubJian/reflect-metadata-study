const Injectable = require('../../src/common/decorators/core/injectable.decorator')

@Injectable()
class AppService {
  getHello(id) {
    return `Hello world! id=${id}`
  }
}

module.exports = AppService
