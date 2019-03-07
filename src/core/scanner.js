const Constants = require('../common/constants')
const Constants2 = require('./constants')
const SharedUtils = require('../common/utils/shared.utils')
const CircularDependencyException = require('./errors/exceptions/circular-dependency.exception')

class DependenciesScanner {
  constructor(container, metadataScanner, applicationConfig) {
    this.container = container
    this.metadataScanner = metadataScanner
    this.applicationConfig = applicationConfig
    this.applicationProvidersApplyMap = []
  }

  async scan(module) {
    await this.scanForModules(module)
    await this.scanModulesForDependencies()
  }

  async scanForModules(module, scope = [], ctxRegistry = []) {
    await this.storeModule(module, scope)
    ctxRegistry.push(module)

    const modules = this.reflectMetadata(module, Constants.METADATA.MODULES)

    for (const innerModule of modules) {
      if (ctxRegistry.includes(innerModule)) {
        continue
      }
      await this.scanForModules(
        innerModule,
        [].concat(scope, module),
        ctxRegistry
      )
    }
  }

  async storeModule(module, scope) {
    await this.container.addModule(module, scope)
  }

  async scanModulesForDependencies() {
    const modules = this.container.getModules()

    for (const [token, { metatype }] of modules) {
      await this.reflectRelatedModules(metatype, token, metatype.name)
      this.reflectComponents(metatype, token)
      this.reflectControllers(metatype, token)
    }
  }

  async reflectRelatedModules(module, token, context) {
    const modules = [
      ...this.reflectMetadata(module, Constants.METADATA.MODULES)
    ]

    for (const related of modules) {
      await this.storeRelatedModule(related, token, context)
    }
  }

  reflectComponents(module, token) {
    const components = [
      ...this.reflectMetadata(module, Constants.METADATA.COMPONENTS)
    ]

    components.forEach(component => {
      this.storeComponent(component, token)
      this.reflectComponentMetadata(component, token)
    })
  }

  reflectComponentMetadata(component, token) {
    this.reflectGatewaysMiddleware(component, token)
  }

  reflectControllers(module, token) {
    const routes = [
      ...this.reflectMetadata(module, Constants.METADATA.CONTROLLERS)
    ]

    routes.forEach(route => {
      this.storeRoute(route, token)
      // this.reflectDynamicMetadata(route, token);
    })
  }

  reflectGatewaysMiddleware(component, token) {
    const middleware = this.reflectMetadata(
      component,
      Constants.GATEWAY_MIDDLEWARES
    )
    middleware.forEach(ware => this.storeComponent(ware, token))
  }

  async storeRelatedModule(related, token, context) {
    if (SharedUtils.isUndefined(related)) {
      throw new CircularDependencyException(context)
    }

    await this.container.addRelatedModule(related, token)
  }

  storeComponent(component, token) {
    return this.container.addComponent(component, token)
  }

  storeRoute(route, token) {
    this.container.addController(route, token)
  }

  reflectMetadata(metatype, metadataKey) {
    return Reflect.getMetadata(metadataKey, metatype) || []
  }

  applyApplicationProviders() {
    const applyProvidersMap = this.getApplyProvidersMap()

    this.applicationProvidersApplyMap.forEach(
      ({ moduleKey, providerKey, type }) => {
        const modules = this.container.getModules()
        const { components } = modules.get(moduleKey)
        const { instance } = components.get(providerKey)
        applyProvidersMap[type](instance)
      }
    )
  }

  getApplyProvidersMap() {
    return {
      [Constants2.APP_INTERCEPTOR]: interceptor =>
        this.applicationConfig.addGlobalInterceptor(interceptor),
      [Constants2.APP_PIPE]: pipe => this.applicationConfig.addGlobalPipe(pipe),
      [Constants2.APP_GUARD]: guard =>
        this.applicationConfig.addGlobalGuard(guard),
      [Constants2.APP_FILTER]: filter =>
        this.applicationConfig.addGlobalFilter(filter)
    }
  }
}

module.exports = DependenciesScanner
