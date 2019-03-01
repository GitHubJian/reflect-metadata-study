const ImplementException = require('../exceptions/implement.exception')

class CanActivateImplement {
  /**
   * @param {ExecutionContext} context
   * @returns {Boolean}
   */
  canActivate(context) {
    throw new ImplementException('CanActivateImplement.canActivate')
  }
}

module.exports = CanActivateImplement
