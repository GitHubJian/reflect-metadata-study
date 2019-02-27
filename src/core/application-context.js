const Iterare = require('iterare')
const SharedUtils = require('../common/utils/shared.utils')

class ApplicationContext {
  constructor(container, scope, contextModule) {
    this.container = container
    this.scope = scope
    this.contextModule = contextModule
  }

  async callInitHook() {
    const modulesContainer = this.container.getModules()
    for (const module of [...modulesContainer.values()].reverse()) {
      await this.callModuleInitHook(module)
    }
  }

  async callModuleInitHook(module) {
    const components = [...module.components]
    const [_, { instance: moduleClassInstance }] = components.shift()
    await Promise.all(
      Iterare.default(instances)
        .map(([key, { instance }]) => instance)
        .filter(instance => !SharedUtils.isNil(instance))
        .filter(this.hasOnModuleDestroyHook)
        .map(async instance => instance.onModuleDestroy())
    )

    if (
      moduleClassInstance &&
      this.hasOnModuleDestroyHook(moduleClassInstance)
    ) {
      await moduleClassInstance.onModuleDestroy()
    }
  }

  hasOnModuleDestroyHook(instance) {
    return !SharedUtils.isUndefined(instance.onModuleDestroy)
  }
}

module.exports = ApplicationContext
