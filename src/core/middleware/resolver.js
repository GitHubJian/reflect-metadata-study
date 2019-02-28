const Injector = require('../injector/injector')

class MiddlewareResolver {
  constructor(middlewareContainer) {
    this.middlewareContainer = middlewareContainer
    this.instanceLoader = new Injector()
  }

  async resolveInstances(module, moduleName) {
    const middleware = this.middlewareContainer.getMiddleware(moduleName)
    await Promise.all(
      [...middleware.values()].map(async wrapper =>
        this.resolveMiddlewareInstance(wrapper, middleware, module)
      )
    )
  }

  resolveMiddlewareInstance(wrapper, middleware, module){
    await this.instanceLoader.loadInstanceOfMiddleware(wrapper, middleware, module);
  }
}

module.exports = MiddlewareResolver
