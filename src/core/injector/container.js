const ModuleCompiler = require('./compiler')
const Module = require('./module')
const RefletorService = require('../services/reflector.service')
const ApplicationReferenceHost = require('../helpers/application-ref-host')
const CircularDependencyException = require('../errors/exceptions/circular-dependency.exception')
const UnknownModuleException = require('../errors/exceptions/unknown-module.exception')

class Container {
  constructor(_applicationConfig) {
    this._applicationConfig = _applicationConfig
    this.moduleCompiler = new ModuleCompiler()
    this.modules = new Map()
    this.reflector = new RefletorService()
    this.applicationRefHost = new ApplicationReferenceHost()
  }

  get applicationConfig() {
    return this._applicationConfig
  }

  /**
   * 设置适配器
   * @param {KoaAdapter} applicationRef 适配器
   */
  setApplicationRef(applicationRef) {
    this.applicationRef = applicationRef
    if (!this.applicationRefHost) {
      return
    }

    this.applicationRefHost.applicationRef = applicationRef
  }

  getApplicationRef() {
    return this.applicationRef
  }

  async addModule(metatype, scope) {
    const { type, token } = await this.moduleCompiler.compile(metatype, scope)
    if (this.modules.has(token)) {
      return
    }

    const module = new Module(type, scope, this)
    this.modules.set(token, module)
  }

  getModules() {
    return this.modules
  }

  async addRelatedModule(relatedModule, token) {
    if (!this.modules.has(token)) {
      return
    }

    const module = this.modules.get(token)
    const parent = module.metatype
    const scope = [].concat(module.scope, parent)
    const { token: relatedModuleToken } = await this.moduleCompiler.compile(
      relatedModule,
      scope
    )
    const related = this.modules.get(relatedModuleToken)
    module.addRelatedModule(related)
  }

  addComponent(component, token) {
    if (!component) {
      throw new CircularDependencyException()
    }

    if (!this.modules.has(token)) {
      throw new UnknownModuleException()
    }

    const module = this.modules.get(token)

    return module.addComponent(component)
  }

  addController(controller, token) {
    if (!this.modules.has(token)) {
      throw new UnknownModuleException()
    }

    const module = this.modules.get(token)
    module.addRoute(controller)
  }

  getReflector() {
    return this.reflector
  }
}

module.exports = Container
