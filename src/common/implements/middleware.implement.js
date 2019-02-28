const ImplementException = require('../exceptions/implement.exception')

class Middleware {
  /**
   * @returns {Function} 
   * (ctx, next) => {
   *  next()
   * }
   */
  resolve(...args) {
    throw new ImplementException('Middleware.resolve')
  }
}

module.exports = Middleware
