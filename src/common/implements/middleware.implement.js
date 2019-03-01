const ImplementException = require('../exceptions/implement.exception')

class MiddlewareImplement {
  /**
   * @returns {Function} 
   * (ctx, next) => {
   *  next()
   * }
   */
  resolve(...args) {
    throw new ImplementException('MiddlewareImplement.resolve')
  }
}

module.exports = MiddlewareImplement
