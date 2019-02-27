const RouterProxy = require('./router-proxy')
const RouterExplorer = require('./router-explorer')
const Constants = require('../../common/constants')
const MetadataScanner = require('../metadata-scanner')
const LoggerService = require('../../common/services/logger.service')
const Messages = require('../helpers/messages')
const RouterExceptionsFilter = require('./router-exception-filters')
const NotFoundException = require('../../common/exceptions/not-found.exception')
const BadRequestException = require('../../common/exceptions/bad-request.exception')

class RoutesResolver {
  constructor(container, config) {
    this.container = container
    this.config = config
    this.routerProxy = new RouterProxy()
    this.routerExceptionsFilter = new RouterExceptionsFilter(
      container,
      config,
      container.getApplicationRef()
    )
    this.routerBuilder = new RouterExplorer(
      new MetadataScanner(),
      this.container,
      this.routerProxy,
      this.config
    )

    this.logger = new LoggerService(RoutesResolver.name, true)
  }

  resolve(appInstance, basePath) {
    const modules = this.container.getModules()
    modules.forEach(({ routes, metatype }, moduleName) => {
      let path = metatype
        ? Reflect.getMetadata(Constants.MODULE_PATH, metatype)
        : undefined
      path = path ? path + basePath : basePath
      this.registerRouters(routes, moduleName, path, appInstance)
    })
  }

  registerRouters(routes, moduleName, basePath, appInstance) {
    routes.forEach(({ instance, metatype }) => {
      const path = this.routerBuilder.extractRouterPath(metatype, basePath)
      const controllerName = metatype.name
      this.logger.log(Messages.CONTROLLER_MAPPING_MESSAGE(controllerName, path))
      this.routerBuilder.explore(
        instance,
        metatype,
        moduleName,
        appInstance,
        path
      )
    })
  }

  registerNotFoundHandler() {
    const applicationRef = this.container.getApplicationRef()
    const callback = ctx => {
      const method = applicationRef.getRequestMethod(ctx)
      const url = applicationRef.getRequestUrl(ctx)

      throw new NotFoundException(`Cannot ${method} ${url}`)
    }

    const handler = this.routerExceptionsFilter.create({}, callback, undefined)
    const proxy = this.routerProxy.createProxy(callback, handler)
    applicationRef.setNotFoundHandler &&
      applicationRef.setNotFoundHandler(proxy)
  }

  registerExceptionHandler() {
    const callback = (err, ctx, next) => {
      throw this.mapExternalException(err)
    }

    const handler = this.routerExceptionsFilter.create({}, callback, undefined);
    const proxy 
    const applicationRef = this.container.getApplicationRef();
        applicationRef.setErrorHandler && applicationRef.setErrorHandler(proxy);
  }

  mapExternalException(err) {
    switch (true) {
      case err instanceof SyntaxError:
        return new BadRequestException(err.message)
      default:
        return err
    }
  }

  registerMountRouter(appInstance) {
    let { httpServer: app, instance: router } = appInstance
    app.use(router.routes()).use(router.allowedMethods())
  }
}

module.exports = RoutesResolver
