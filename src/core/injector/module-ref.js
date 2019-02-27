const ContainerScanner = require('./container-scanner')
const Injector = require('./injector')

class ModuleRef {
  constructor(container) {
    this.container = container
    this.injector = new Injector()
  }

  async instantiateClass(type, module) {
    const wrapper = {
      name: type.name,
      metatype: type,
      instance: undefined,
      isResolved: false
    }

    return new Promise(async (resolve, reject) => {
      try {
        const callback = async instances => {
          const properties = await this.injector.resolveProperties(
            wrapper,
            module
          )
          const instance = new type(...instances)
          this.injector.applyProperties(instance, properties)
          resolve(instance)
        }

        await this.injector.resolveConstructorParams(
          wrapper,
          module,
          undefined,
          callback
        )
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = ModuleRef
