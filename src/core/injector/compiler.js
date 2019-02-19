const ModuleTokenFactory = require('./module-token-factory')

class ModuleCompiler {
  constructor() {
    this.moduleTokenFactory = new ModuleTokenFactory()
  }

  async compile(metatype, scope) {
    const { type } = await this.extractMetadata(metatype)
    const token = this.moduleTokenFactory.create(type, scope)
    return { type, token }
  }

  async extractMetadata(metatype) {
    metatype = await metatype
    const { module: type } = metatype

    return { type }
  }
}

module.exports = ModuleCompiler
