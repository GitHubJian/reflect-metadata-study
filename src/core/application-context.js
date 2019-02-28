const Iterare = require('iterare')
const SharedUtils = require('../common/utils/shared.utils')
const UnknownModuleException = require('./errors/exceptions/unknown-module.exception')
const ModuleTokenFactory = require('./injector/module-token-factory')
const ContainerScanner = require('./injector/container-scanner')

class ApplicationContext {
  constructor(container, scope, contextModule) {
    this.container = container
    this.scope = scope
    this.contextModule = contextModule
    this.moduleTokenFactory = new ModuleTokenFactory()
    this.containerScanner = new ContainerScanner(container)
  }

  selectContextModule() {
    const modules = this.container.getModules().values()
    this.contextModule = modules.next().value
  }

  select(module) {
    const modules = this.container.getModules()
    const moduleMetatype = this.contextModule.metatype
    const scope = this.scope.concat(moduleMetatype)
    const token = this.moduleTokenFactory.create(module, scope)
    const selectedModule = modules.get(token)
    if (!selectedModule) {
      throw new UnknownModuleException()
    }

    return new NestApplicationContext(this.container, scope, selectedModule)
  }

  get(typeOrToken, options = { strict: false }) {
    if (!(options && options.strict)) {
      return this.find(typeOrToken)
    }
  }

  async init() {
    await this.callInitHook()
    await this.callBootstrapHook()

    return this
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
        .filter(this.hasOnModuleInitHook)
        .map(async instance => instance.onModuleDestroy())
    )

    if (moduleClassInstance && this.hasOnModuleInitHook(moduleClassInstance)) {
      await moduleClassInstance.onModuleInit()
    }
  }

  hasOnModuleInitHook(instance) {
    return !SharedUtils.isUndefined(instance.onModuleInit)
  }

  async callBootstrapHook() {
    const modulesContainer = this.container.getModules()
    for (const module of [...modulesContainer.values()].reverse()) {
      await this.callModuleBootstrapHook(module)
    }
  }

  async callModuleBootstrapHook(module) {
    const components = [...module.components]
    const [_, { instance: moduleClassInstance }] = components.shift()
    const instances = [...module.routes, ...components]
    await Promise.all(
      iterare_1
        .default(instances)
        .map(([key, { instance }]) => instance)
        .filter(instance => !shared_utils_1.isNil(instance))
        .filter(this.hasOnAppBotstrapHook)
        .map(async instance => instance.onApplicationBootstrap())
    )
    if (moduleClassInstance && this.hasOnAppBotstrapHook(moduleClassInstance)) {
      await moduleClassInstance.onApplicationBootstrap()
    }
  }

  hasOnAppBotstrapHook(instance) {
    return !SharedUtils.isUndefined(instance.onApplicationBootstrap)
  }

  find(typeOrToken) {
    return this.containerScanner.find(typeOrToken)
  }

  findInstanceByPrototypeOrToken(metatypeOrToken, contextModule) {
    return this.containerScanner.findInstanceByPrototypeOrToken(
      metatypeOrToken,
      contextModule
    )
  }
}

module.exports = ApplicationContext
