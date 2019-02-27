let uuid = 1

const ModuleCompiler = {
  compile: async function(metatype, scope) {
    uuid += 1
    const token = uuid

    return { token }
  }
}

const Container = {
  modules: new Map(),
  addModule: function(module) {
    let { token } = ModuleCompiler.compile(module)
    this.modules.set(token, module)
  },
  getModules: function() {
    return this.modules
  }
}

class DependenciesScanner {
  constructor(container, metadataScanner, applicationConfig) {
    this.container = Container
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
  }

  async storeModule(module, scope) {
    await this.container.addModule(module, scope)
  }

  async scanModulesForDependencies() {
    const modules = this.container.getModules()
    for (const [token] of modules) {
      console.log(token)
    }
  }
}

module.exports = DependenciesScanner
