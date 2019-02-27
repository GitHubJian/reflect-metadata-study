const ApplicationContext = require('./application-context')
const SharedUtils = require('../common/utils/shared.utils')
const Http = require('http')
const RoutesResolver = require('./router/routes-resolver')
const MiddlewareContainer = require('./middleware/middleware-module')
const LoggerService = require('../common/services/logger.service')
const Constants = require('../core/constants')
const Koa = require('koa')
const KoaRouter = require('koa-router')

class Application extends ApplicationContext {
  constructor(container, httpAdapter, config, appOptions = {}) {
    super(container, [], null)
    this.httpAdapter = httpAdapter
    this.config = config
    this.appOptions = appOptions
    this.logger = new LoggerService(Application.name, true)
    this.middlewareModule = new MiddlewareContainer()
    this.isInitialized = false

    this.registerHttpServer()
    this.routesResolver = new RoutesResolver(this.container, this.config)
  }

  registerHttpServer() {
    this.httpServer = this.createServer()
  }

  createServer() {
    const server = new Koa()
    this.httpAdapter.setHttpServer(server)

    return server
  }

  async init() {
    // await this.registerModules()
    await this.registerRouter()
    await this.registerRouterHooks()

    this.isInitialized = true
    this.logger.log(Constants.MESSAGES.APPLICATION_READY)

    return this
  }

  async registerModules() {
    await this.middlewareModule.register(
      this.middlewareContainer,
      this.container,
      this.config
    )
  }

  async registerRouter() {
    const prefix = this.config.getGlobalPrefix()
    const basePath = SharedUtils.validatePath(prefix)
    this.routesResolver.resolve(this.httpAdapter, basePath)
  }

  async registerRouterHooks() {
    this.routesResolver.registerMountRouter(this.httpAdapter)
    this.routesResolver.registerNotFoundHandler()
    this.routesResolver.registerExceptionHandler()
  }

  use(...args) {
    this.httpServer.use(...args)
    return this
  }

  async listen(port, ...args) {
    !this.isInitialized && (await this.init())
    this.httpServer.listen(port, ...args)

    return this.httpServer
  }
}

module.exports = Application
