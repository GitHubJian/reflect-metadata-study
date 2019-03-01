const RouterProxy = require('../router/router-proxy')
const RoutesMapper = require('./routes-mapper')
const RouterExceptionFilters = require('../router/router-exception-filters')
const MiddlewareResolver = require('./resolver')
const MiddlewareBuilder = require('./builder')

class MiddlewareModule {
  constructor() {
    this.routerProxy = new RouterProxy()
  }

  async register(middlewareContainer, container, config) {
    const appRef = container.getApplicationRef()
    this.routerExceptionFilter = new RouterExceptionFilters(
      container,
      config,
      appRef
    )
    this.routesMapper = new RoutesMapper(container)
    this.resolver = new MiddlewareResolver(middlewareContainer)
    this.config = config
    const modules = container.getModules()
    await this.resolveMiddleware(middlewareContainer, modules)
  }

  async resolveMiddleware(middlewareContainer, modules) {
    debugger
    await Promise.all(
      [...modules.entries()].map(async ([name, module]) => {
        const instance = module.instance
        this.loadConfiguration(middlewareContainer, instance, name)
        await this.resolver.resolveInstances(module, name)
      })
    )
  }

  loadConfiguration(middlewareContainer, instance, module) {
    if (!instance.configure) return
    const middlewareBuilder = new MiddlewareBuilder(this.routesMapper)
    instance.configure(middlewareBuilder)
    if (!(middlewareBuilder instanceof MiddlewareBuilder)) return
    const config = middlewareBuilder.build()
    middlewareContainer.addConfig(config, module)
  }
}

module.exports = MiddlewareModule
