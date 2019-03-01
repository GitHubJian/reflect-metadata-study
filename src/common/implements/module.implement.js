const ImplementException = require('../exceptions/implement.exception')

class ModuleImplement {
  /**
   * @param {MiddlewareConsumer} consumer
   */
  configure(consumer) {
    throw new ImplementException('ModuleImplement.configure')
  }
}

module.exports = ModuleImplement
