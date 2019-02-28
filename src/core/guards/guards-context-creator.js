const ContextCreator = require('../helpers/context-creator')
const Constants = require('../../common/constants')
const SharedUtils = require('../../common/utils/shared.utils')
const Iterare = require('iterare')

class GuardsContextCreator extends ContextCreator {
  constructor(container, config) {
    super()
    this.container = container
    this.config = config
  }

  create(instance, callback, module) {
    this.moduleContext = module

    return this.createContext(instance, callback, Constants.GUARDS_METADATA)
  }

  createConcreteContext(metadata) {
    if (SharedUtils.isEmpty(metadata)) {
      return []
    }

    return Iterare.default(metadata)
      .filter(guard => guard && (guard.name || guard.canActivate))
      .map(guard => this.getGuardInstance(guard))
      .filter(guard => guard && SharedUtils.isFunction(guard.canActivate))
      .toArray()
  }

  getGuardInstance(guard) {
    const isObject = guard.canActivate
    if (isObject) {
      return guard
    }

    const instanceWrapper = this.getInstanceByMetatype(guard)
    return instanceWrapper && instanceWrapper.instance
      ? instanceWrapper.instance
      : null
  }

  getInstanceByMetatype(guard) {
    if (!this.moduleContext) {
      return undefined
    }
    const collection = this.container.getModules()
    const module = collection.get(this.moduleContext)
    if (!module) {
      return undefined
    }
    return module.injectables.get(guard.name)
  }
}

module.exports = GuardsContextCreator
