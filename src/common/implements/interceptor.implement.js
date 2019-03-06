const ImplementException = require('../exceptions/implement.exception')

class InterceptorImplement {
  /**
   * @param {ExecutionContext} context
   * @param {Observable} call$
   * @returns {Boolean}
   */
  intercept(context, call$) {
    throw new ImplementException('InterceptorImplement.canActivate')
  }
}

module.exports = InterceptorImplement
