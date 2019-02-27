const RouterProxy = require('../router/router-proxy')
const RoutesMapper = require('../middleware/routes-mapper')

class MiddlewareModule {
  constructor() {
    this.routerProxy = new RouterProxy()
  }

  async register(middlewareContainer, container, config) {
    this.routesMapper = new RoutesMapper(container)
    const modules = container.getModules()
    await this.resolveMiddleware(middlewareContainer, modules)
  }

  async resolveMiddleware(middlewareContainer, modules){
    
  }
}

module.exports = MiddlewareModule
