const ModulesContainer = require('./modules-container')
const ApplicationReferenceHost = require('../helpers/application-ref-host')
const InvalidModuleException = require('../errors/exceptions/invalid-module.exception')
const Compiler = require('./compiler')
const Module = require('./module')
const Constants = require('../../common/constants')

class Container {
  constructor(_applicationConfig = undefined) {
    this._applicationConfig = _applicationConfig
    this.globalModules = new Set()
    this.moduleCompiler = new Compiler()
    this.modules = new ModulesContainer()
    this.applicationRefHost = new ApplicationReferenceHost()
  }

  get applicationConfig() {
    return this._applicationConfig
  }

  setApplicationRef(applicationRef) {
    this.applicationRef = applicationRef
    if (!this.applicationRefHost) {
      return
    }
    this.applicationRefHost.applicationRef = applicationRef
  }

  async addModule(metatype, scope) {
    if (!metatype) {
      throw new InvalidModuleException(scope)
    }

    const { type, token } = await this.moduleCompiler.compile(metatype, scope)
    if (this.modules.has(token)) {
      return
    }
    const module = new Module(type, scope, this)
    this.modules.set(token, module)

    this.isGlobalModule(type) && this.addGlobalModule(module)
  }

  isGlobalModule(metatype) {
    return !!Reflect.getMetadata(Constants.GLOBAL_MODULE_METADATA, metatype)
  }

  addGlobalModule(module) {
    this.globalModules.add(module)
  }

  getModules() {
    return this.modules
  }
}

module.exports = Container
