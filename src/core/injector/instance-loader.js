const Injector = require('./injector')
const Messages = require('../helpers/messages')

class InstanceLoader {
  constructor(container) {
    this.container = container
    this.injector = new Injector()
    this.logger = console
  }

  async createInstancesOfDependencies() {
    const modules = this.container.getModules()
    this.createPrototypes(modules)
    await this.createInstances(modules)
  }

  createPrototypes(modules) {
    modules.forEach(module => {
      this.createPrototypesOfComponents(module)
      this.createPrototypesOfInjectables(module)
      this.createPrototypesOfRoutes(module)
    })
  }

  async createInstances(modules) {
    await Promise.all(
      [...modules.values()].map(async module => {
        await this.createInstancesOfComponents(module)
        await this.createInstancesOfInjectables(module)
        await this.createInstancesOfRoutes(module)

        const { name } = module.metatype

        this.logger.log(Messages.MODULE_INIT_MESSAGE('', name))
      })
    )
  }

  createPrototypesOfComponents(module) {
    module.components.forEach(wrapper => {
      this.injector.loadPrototypeOfInstance(wrapper, module.components)
    })
  }

  async createInstancesOfComponents(module) {
    await Promise.all(
      [...module.components.values()].map(async wrapper =>
        await this.injector.loadInstanceOfComponent(wrapper, module)
      )
    )
  }

  createPrototypesOfRoutes(module) {
    module.routes.forEach(wrapper => {
      this.injector.loadPrototypeOfInstance(wrapper, module.routes)
    })
  }

  async createInstancesOfRoutes(module) {
    await Promise.all(
      [...module.routes.values()].map(async wrapper => {
        await this.injector.loadInstanceOfRoute(wrapper, module)
      })
    )
  }

  createPrototypesOfInjectables(module) {
    module.injectables.forEach(wrapper => {
      this.injector.loadPrototypeOfInstance(wrapper, module.injectables)
    })
  }

  async createInstancesOfInjectables(module) {
    await Promise.all(
      [...module.injectables.values()].map(async wrapper =>
        await this.injector.loadInstanceOfInjectable(wrapper, module)
      )
    )
  }
}

module.exports = InstanceLoader
