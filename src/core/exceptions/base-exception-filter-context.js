const ContextCreator = require('../helpers/context-creator')
const SharedUtils = require('../../common/utils/shared.utils')
const Iterare = require('iterare')
const Constants = require('../../common/constants')

class BaseExceptionFilterContext extends ContextCreator {
  constructor(container) {
    super()
    this.container = container
  }

  createConcreteContext(metadata) {
    if (SharedUtils.isEmpty(metadata)) {
      return []
    }

    return Iterare.default(metadata)
      .filter(
        instance =>
          instance && (SharedUtils.isFunction(instance.catch) || instance.name)
      )
      .map(filter => this.getFilterInstance(filter))
      .map(instance => ({
        func: instance.catch.bind(instance),
        exceptionMetatypes: this.reflectCatchExceptions(instance)
      }))
      .toArray()
  }

  getFilterInstance(filter) {
    const isObject = filter.catch
    if (isObject) {
      return filter
    }

    const instanceWrapper = this.getInstanceByMetatype(filter)

    return instanceWrapper && instanceWrapper.instance
      ? instanceWrapper.instance
      : null
  }

  getInstanceByMetatype(filter) {
    if (!this.moduleContext) {
      return undefined
    }

    const collection = this.container.getModules()
    const module = collection.get(this.moduleContext)
    if (!module) {
      return undefined
    }

    return module.injectables.get(filter.name)
  }

  reflectCatchExceptions(instance) {
    const prototype = Object.getPrototypeOf(instance)

    return (
      Reflect.getMetadata(
        Constants.FILTER_CATCH_EXCEPTIONS,
        prototype.constuctor
      ) || []
    )
  }
}

module.exports = BaseExceptionFilterContext
