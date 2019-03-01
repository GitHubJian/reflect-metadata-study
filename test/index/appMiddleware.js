const MiddlewareImplement = require('../../src/common/implements/middleware.implement')

class LoggerMiddleware extends MiddlewareImplement {
  resolve(...args) {
    debugger
    return async (ctx, next) => {
      debugger
    }
  }
}

module.exports = LoggerMiddleware
