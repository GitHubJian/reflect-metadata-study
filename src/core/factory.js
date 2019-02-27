const Container = require('./injector/container')
const InstanceLoader = require('./injector/instance-loader')
const Scanner = require('./scanner')
const ApplicationConfig = require('./application-config')
const Application = require('./application')
const SharedUtils = require('../common/utils/shared.utils')
const ExceptionsZone = require('./errors/exceptions-zone')
const KoaFactory = require('../core/adapters/koa-factory')
const LoggerService = require('../common/services/logger.service')
const KoaAdapter = require('../core/adapters/koa-adapter')

class FactoryStatic {
  constructor() {
    this.logger = new LoggerService('Factory', true)
  }

  async create(module, serverOrOptions, options) {
    let [httpServer, appOptions] = [KoaFactory.create(), serverOrOptions]
    const container = new Container()
    const applicationConfig = new ApplicationConfig()

    httpServer = this.applyKoaAdapter(httpServer)
    this.applyLogger(appOptions)

    await this.initialize(module, container, applicationConfig, httpServer)
    return this.createApplicationInstance(
      new Application(container, httpServer, applicationConfig, options)
    )
  }

  async initialize(
    module,
    container,
    config = new ApplicationConfig(),
    httpServer
  ) {
    const instanceLoader = new InstanceLoader(container)
    const dependenciesScanner = new Scanner(container, null, config)
    container.setApplicationRef(httpServer)

    try {
      await dependenciesScanner.scan(module)
      await instanceLoader.createInstancesOfDependencies()
    } catch (e) {
      console.error(e)
      console.error(e.stack)
      process.abort()
    }
  }

  createApplicationInstance(instance) {
    return this.createProxy(instance)
  }

  createProxy(target) {
    const proxy = this.createExceptionProxy()

    return new Proxy(target, {
      get: proxy,
      set: proxy
    })
  }

  createExceptionProxy() {
    return (receiver, prop) => {
      if (!(prop in receiver)) return

      if (SharedUtils.isFunction(receiver[prop])) {
        return (...args) => {
          let result
          ExceptionsZone.run(() => {
            result = receiver[prop](...args)
          })

          return result
        }
      }

      return receiver[prop]
    }
  }

  applyLogger(options) {
    if (!options) {
      return
    }

    !SharedUtils.isNil(options.logger) &&
      LoggerService.overrideLogger(options.logger)
  }

  applyKoaAdapter(httpAdapter) {
    const isAdapter = httpAdapter.getHttpServer
    if (isAdapter) {
      return httpAdapter
    }

    return new KoaAdapter(httpAdapter)
  }
}

module.exports = {
  FactoryStatic,
  Factory: new FactoryStatic()
}
