const RouterMethodFactory = require('../helpers/router-method-factory')
const Constans = require('../../common/constants')
const SharedUtils = require('../../common/utils/shared.utils')
const LoggerService = require('../../common/services/logger.service')
const RouterExecutionContext = require('./router-execution-context')
const RouteParamsFactory = require('./route-params-factory')
const InterceptorsContextCreator = require('../interceptors/interceptors-context-creator')
const Messages = require('../helpers/messages')
const InterceptorsConsumer = require('../interceptors/interceptors-consumer')
const PipesContextCreator = require('../pipes/pipes-context-creator')
const PipesConsumer = require('../pipes/pipes-consumer')
const GuardsContextCreator = require('../guards/guards-context-creator')
const GuardsConsumer = require('../guards/guards-consumer')

class RouterExplorer {
  constructor(
    metadataScanner,
    container,
    routerProxy,
    exceptionsFilter,
    config
  ) {
    this.metadataScanner = metadataScanner
    this.container = container
    this.routerProxy = routerProxy
    this.exceptionsFilter = exceptionsFilter
    this.config = config

    this.routerMethodFactory = new RouterMethodFactory()
    this.logger = new LoggerService(RouterExplorer.name, true)
    this.executionContextCreator = new RouterExecutionContext(
      new RouteParamsFactory(),
      new PipesContextCreator(container, config),
      new PipesConsumer(),
      new GuardsContextCreator(container, config),
      new GuardsConsumer(),
      new InterceptorsContextCreator(container, config),
      new InterceptorsConsumer(),
      container.getApplicationRef()
    )
  }

  explore(instance, metatype, module, appInstance, basePath) {
    const routerPaths = this.scanForPaths(instance)
    this.applyPathsToRouterProxy(
      appInstance,
      routerPaths,
      instance,
      module,
      basePath
    )
  }

  extractRouterPath(metatype, prefix) {
    let path = Reflect.getMetadata(Constans.PATH_METADATA, metatype)
    if (prefix) path = prefix + this.validateRoutePath(path)

    return this.validateRoutePath(path)
  }

  validateRoutePath(path) {
    if (SharedUtils.isUndefined(path)) {
    }

    return SharedUtils.validatePath(path)
  }

  scanForPaths(instance, prototype) {
    const instancePrototype = SharedUtils.isUndefined(prototype)
      ? Object.getPrototypeOf(instance)
      : prototype

    return this.metadataScanner.scanFromPrototype(
      instance,
      instancePrototype,
      method => this.exploreMethodMetadata(instance, instancePrototype, method)
    )
  }

  exploreMethodMetadata(instance, instancePrototype, methodName) {
    const targetCallback = instancePrototype[methodName]
    const routePath = Reflect.getMetadata(
      Constans.PATH_METADATA,
      targetCallback
    )
    if (SharedUtils.isUndefined(routePath)) {
      return null
    }
    const requestMethod = Reflect.getMetadata(
      Constans.METHOD_METADATA,
      targetCallback
    )
    const path = SharedUtils.isString(routePath)
      ? [this.validateRoutePath(routePath)]
      : routePath.map(p => this.validateRoutePath(p))

    return {
      path,
      requestMethod,
      targetCallback,
      methodName
    }
  }

  // router -> koa-router
  applyPathsToRouterProxy(router, routePaths, instance, module, basePath) {
    ;(routePaths || []).forEach(pathProperties => {
      const { path, requestMethod } = pathProperties
      this.applyCallbackToRouter(
        router,
        pathProperties,
        instance,
        module,
        basePath
      )

      path.forEach(p => {
        return this.logger.log(Messages.ROUTE_MAPPED_MESSAGE(p, requestMethod))
      })
    })
  }
  // 此处定义路由
  applyCallbackToRouter(router, pathProperties, instance, module, basePath) {
    const {
      path: paths,
      requestMethod,
      targetCallback,
      methodName
    } = pathProperties

    const routerMethod = this.routerMethodFactory
      .get(router, requestMethod)
      .bind(router)

    const proxy = this.createCallbackProxy(
      instance,
      targetCallback,
      methodName,
      module,
      requestMethod
    )

    const stripSlash = str =>
      str[str.length - 1] === '/' ? str.slice(0, str.length - 1) : str

    paths.forEach(path => {
      const fullPath = stripSlash(basePath) + path
      routerMethod(stripSlash(fullPath) || '/', proxy)
    })
  }

  createCallbackProxy(instance, callback, methodName, module, requestMethod) {
    const executionContext = this.executionContextCreator.create(
      instance,
      callback,
      methodName,
      module,
      requestMethod
    )
    const exceptionFilter = this.exceptionsFilter.create(
      instance,
      callback,
      module
    )

    return this.routerProxy.createProxy(executionContext, exceptionFilter)
  }
}

module.exports = RouterExplorer
