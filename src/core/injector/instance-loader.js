const Injector = require('./injector')
const LoggerService = require('../../common/services/logger.service')
const Messages = require('../helpers/messages')

class InstanceLoader {
  constructor(container) {
    this.container = container
    this.injector = new Injector()
    this.logger = new LoggerService(InstanceLoader.name, true)
  }

  async createInstancesOfDependencies() {
    const modules = this.container.getModules()
    // this.createPrototypes(modules)  // ??
    await this.createInstances(modules)
  }

  async createInstances(modules) {
    await Promise.all(
      [...modules.values()].map(async module => {
        // await this.createInstancesOfComponents(module)
        // await this.createInstancesOfInjectables(module)
        // await this.createInstancesOfRoutes(module)
        this.logger.log(Messages.MODULE_INIT_MESSAGE('', module))
      })
    )
  }
}

module.exports = InstanceLoader
