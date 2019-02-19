const ApplicationConfig = require('./application-config')
const Constants = require('../common/constants')
const SharedUtils = require('../common/utils/shared.utils')

class DependenciesScanner {
  constructor(
    container,
    metadataScanner,
    applicationConfig = new ApplicationConfig()
  ) {
    this.container = container
    this.metadataScanner = metadataScanner
    this.applicationConfig = applicationConfig
    this.applicationProvidersApplyMap = []
  }

  async scan(module) {
    await this.scanForModules(module)
    // await this.scanModulesForDependencies() // ?
  }

  async scanForModules(module, scope = [], ctxRegistry = []) {
    await this.storeModule(module, scope)
    ctxRegistry.push(module)
    this.reflectMetadata(module, Constants.METADATA.MODULES)
  }

  async storeModule(module, scope) {
    await this.container.addModule(module, scope)
  }

  async scanModulesForDependencies() {
    const modules = this.container.getModules()
    for (const [token, { metatype }] of modules) {
      await this.reflectRelatedModules(metatype, token, metatype.name)
    }
  }

  async reflectRelatedModules(module, token, context) {
    const modules = [
      ...this.reflectMetadata(module, Constants.METADATA.MODULES)
    ]

    for (const related of modules) {
      // ?
      await this.storeRelatedModule(related, token, context)
    }
  }

  async storeRelatedModule(related, token, context) {
    if (SharedUtils.isUndefined(related)) {
      throw 'circule' //
    }

    await this.container.addRelatedModule(related, token)
  }

  reflectMetadata(metatype, metadataKey) {
    return Reflect.getMetadata(metadataKey, metatype) || []
  }

  applyApplicationProviders() {
    const applyProvidersMap = this.getApplyProvidersMap()
    this.getApplyProvidersMap.forEach(({ moduleKey, providerKey, type }) => {
      const modules = this.container.getModules()
      const { components } = modules.get(moduleKey)
      const { instance } = components.get(providerKey)
      applyProvidersMap[type](instance)
    })
  }

  getApplyProvidersMap() {
    return {}
  }
}

module.exports = { DependenciesScanner }
