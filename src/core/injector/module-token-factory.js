const hash = require('object-hash')

class ModuleTokenFactory {
  create(metatype) {
    const opaqueToken = {
      module: this.getModuleName(metatype)
    }

    return hash(opaqueToken)
  }

  getModuleName(metatype) {
    return metatype.name
  }
}

module.exports = ModuleTokenFactory
