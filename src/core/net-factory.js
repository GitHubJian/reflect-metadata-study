require('reflect-metadata')
const ApplicationConfig = require('./application-config')
const Container = require('./injector/container')
const SharedUtils = require('../common/utils/shared.utils')
const LoggerService = require('../common/services/logger.service')
const InstanceLoader = require('./injector/instance-loader')
const Scanner = require('./scanner')
const MetadataScanner = require('./metadata-scanner')
const Constants = require('./constants')
const ExceptionsZone = require('./errors/exceptions-zone')

class FactoryStatic {
  constructor() {
    this.logger = new LoggerService('Factory', true)
  }

  async create(module, serverOrOptions, options) {
    let [httpServer, appOptions] = [serverOrOptions, options]
    const applicationConfig = new ApplicationConfig()
    const container = new Container(applicationConfig)
    this.applyLogger(appOptions)
    await this.initalize(module, container, applicationConfig, httpServer)
    return this.createNestInstance()
  }

  createNestInstance(instance) {
    return this.createProxy(instance)
  }

  async initalize(
    module,
    container,
    config = new ApplicationConfig(),
    httpServer = null
  ) {
    const instanceLoader = new InstanceLoader(container)
    const dependenciesScanner = new Scanner.DependenciesScanner(
      container,
      new MetadataScanner(),
      config
    )
    container.setApplicationRef(httpServer)

    try {
      this.logger.log(Constants.MESSAGES.APPLICATION_START)
      await ExceptionsZone.asyncRun(async () => {
        await dependenciesScanner.scan(module)
        await instanceLoader.createInstancesOfDependencies()
        dependenciesScanner.applicationProvidersApplyMap()
      })
    } catch (e) {
      process.abort()
    }
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
}

module.exports = {
  FactoryStatic,
  Factory: new FactoryStatic()
}
