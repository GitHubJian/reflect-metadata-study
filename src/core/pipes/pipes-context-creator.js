const ContextCreator = require('../helpers/context-creator')
const Constants = require('../../common/constants')
const SharedUtils = require('../../common/utils/shared.utils')
const Iterare = require('iterare')

class PipesContextCreator extends ContextCreator {
  constructor(container, config) {
    super()
    this.container = container
    this.config = config
  }

  create(instance, callback, module) {
    this.moduleContext = module

    return this.createContext(instance, callback, Constants.PIPES_METADATA)
  }

  createConcreteContext(metadata) {
    if (SharedUtils.isEmpty(metadata)) {
      return []
    }

    return Iterare.default(metadata)
      .filter(pipe => pipe && (pipe.name || pipe.transform))
      .map(pipe => this.getPipeInstance(pipe))
  }

  getPipeInstance(pipe) {
    const isObject = pipe.transform
    if (isObject) {
      return pipe
    }

    const instanceWrapper = this.getInstanceByMetatype(pipe)

    return instanceWrapper && instanceWrapper.instance
      ? instanceWrapper.instance
      : null
  }

  getInstanceByMetatype(metatype) {
    if (!this.moduleContext) {
      return undefined
    }

    const collection = this.container.getModules()
    const module = collection.get(this.moduleContext)
    if (!module) {
      return undefined
    }

    return module.injectables.get(metatype.name)
  }

  setModuleContext(context) {
    this.moduleContext = context
  }
}

module.exports = PipesContextCreator
