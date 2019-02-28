const ImplementException = require('../exceptions/implement.exception')

class CanActivate {
  /**
   * @param {ExecutionContext} context
   * @returns {Boolean}
   */
  canActivate(context) {
    throw new ImplementException('CanActivate.canActivate')
  }
}

module.exports = CanActivate
