const ModuleRef = require('./module-ref')
const randomStringGenerator = require('../../common/utils/random-string-generator.util.js')

class Module {
  constructor(_metatype, _scope, container) {
    this._metatype = _metatype
    this._scope = _scope
    this.container = container
    this._components = new Map()
    this._injectables = new Map()
    this._routes = new Map()
    this.addCoreInjectables(container)
    this._id = randomStringGenerator()
  }

  get id() {
    return this._id
  }

  get scope() {
    return this._scope
  }

  get components() {
    return this._components
  }

  get injectables() {
    return this._injectables
  }

  get routes() {
    return this._routes
  }

  get metatype() {
    return this._metatype
  }

  get instance() {
    const module = this._components.get(this._metatype.name)
    return module.instance
  }

  addCoreInjectables(container) {
    this.addModuleAsComponent()
    this.addModuleRef()
  }

  addModuleRef() {
    const moduleRef = this.createModuleRefMetatype()
    this._components.set(ModuleRef.name, {
      name: ModuleRef.name,
      metatype: ModuleRef,
      isResolved: true,
      instance: new moduleRef()
    })
  }
  // module -> imports
  // providers -> component
  // addImportsAsProviders
  addModuleAsComponent() {
    this._components.set(this._metatype.name, {
      name: this._metatype.name,
      metatype: this._metatype,
      isResolved: false,
      instance: null
    })
  }

  createModuleRefMetatype() {
    const self = this

    return class extends ModuleRef {
      constructor() {
        super(self.container)
      }

      async create(type) {
        return this.instantiateClass(type, self)
      }
    }
  }

  addRoute(route) {
    this._routes.set(route.name, {
      name: route.name,
      metatype: route,
      instance: null,
      isResolved: false
    })
  }
  
  addComponent(component) {
    this._components.set(component.name, {
      name: component.name,
      metatype: component,
      instance: null,
      isResolved: false
    })

    return component.name
  }
}

module.exports = Module