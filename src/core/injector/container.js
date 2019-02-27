const ModuleCompiler = require('./compiler')
const Module = require('./module')
const RefletorService = require('../services/reflector.service')
const ApplicationReferenceHost = require('../helpers/application-ref-host')

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

  addComponent(component, token) {
    const module = this.modules.get(token)

    return module.addComponent(component)
  }

  addController(controller, token) {
    const module = this.modules.get(token)
    module.addRoute(controller)
  }
}

module.exports = Container
