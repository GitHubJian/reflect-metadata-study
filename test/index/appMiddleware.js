const MiddlewareImplement = require('../../src/common/implements/middleware.implement')
const Injectable = require('../../src/common/decorators/core/injectable.decorator')

@Injectable()
class LoggerMiddleware extends MiddlewareImplement {
  resolve(...args) {
    return async (ctx, next) => {
      console.log('Request...')
      await next()
    }
  }
}

module.exports = LoggerMiddleware
