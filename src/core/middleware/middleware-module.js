const RouterProxy = require('../router/router-proxy')
const RoutesMapper = require('./routes-mapper')
const RouterExceptionFilters = require('../router/router-exception-filters')
const MiddlewareResolver = require('./resolver')
const MiddlewareBuilder = require('./builder')
const SharedUtils = require('../../common/utils/shared.utils')
const RuntimeException = require('../errors/exceptions/runtime.exception')
const InvalidMiddlewareException = require('../errors/exceptions/invalid-middleware.exception')

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

  async registerMiddleware(middlewareContainer, applicationRef) {
    const configs = middlewareContainer.getConfigs()
    const registerAllConfigs = (module, middlewareConfig) =>
      middlewareConfig.map(async config => {
        await this.registerMiddlewareConfig(
          middlewareContainer,
          config,
          module,
          applicationRef
        )
      })
    await Promise.all(
      [...configs.entries()].map(async ([module, moduleConfigs]) => {
        await Promise.all(registerAllConfigs(module, [...moduleConfigs]))
      })
    )
  }

  async registerMiddlewareConfig(
    middlewareContainer,
    config,
    module,
    applicationRef
  ) {
    const { forRoutes } = config
    await Promise.all(
      forRoutes.map(async routeInfo => {
        await this.registerRouteMiddleware(
          middlewareContainer,
          routeInfo,
          config,
          module,
          applicationRef
        )
      })
    )
  }

  async registerRouteMiddleware(
    middlewareContainer,
    routeInfo,
    config,
    module,
    applicationRef
  ) {
    const middlewareCollection = [].concat(config.middleware)
    await Promise.all(
      middlewareCollection.map(async metatype => {
        const collection = middlewareContainer.getMiddleware(module)
        const middleware = collection.get(metatype.name)
        if (SharedUtils.isUndefined(middleware)) {
          throw new RuntimeException()
        }
        const { instance } = middleware

        await this.bindHandler(
          instance,
          metatype,
          applicationRef,
          routeInfo.method,
          routeInfo.path
        )
      })
    )
  }

  async bindHandler(instance, metatype, applicationRef, method, path) {
    if (SharedUtils.isUndefined(instance.resolve)) {
      throw new InvalidMiddlewareException(metatype.name)
    }
    const exceptionsHandler = this.routerExceptionFilter.create(
      instance,
      instance.resolve,
      undefined
    )
    
    const router = applicationRef.createMiddlewareFactory(method)
    const bindWithProxy = middlewareInstance =>
      this.bindHandlerWithProxy(
        exceptionsHandler,
        router,
        middlewareInstance,
        path
      )
    const resolve = instance.resolve()
    const middleware = await resolve

    bindWithProxy(middleware)
  }

  bindHandlerWithProxy(exceptionsHandler, router, middleware, path) {
    const proxy = this.routerProxy.createProxy(middleware, exceptionsHandler)
    const prefix = this.config.getGlobalPrefix()
    const basePath = SharedUtils.validatePath(prefix)

    router(basePath + path, proxy)
  }
}

module.exports = MiddlewareModule
