const ContextCreator = require('../helpers/context-creator')
const Constants = require('../../common/constants')
const SharedUtils = require('../../common/utils/shared.utils')
const Iterare = require('iterare')

class InterceptorsContextCreator extends ContextCreator {
  constructor(container, config) {
    super()
    this.container = container
    this.config = config
  }

  create(instance, callback, module) {
    this.moduleContext = module

    return this.createContext(
      instance,
      callback,
      Constants.INTERCEPTORS_METADATA
    )
  }

  createConcreteContext(metadata) {
    if (SharedUtils.isEmpty(metadata)) {
      return []
    }

    return Iterare.default(metadata)
      .filter(
        interceptor =>
          interceptor && (interceptor.name || interceptor.intercept)
      )
      .map(interceptor => this.getInterceptorInstance(interceptor))
  }

  getInterceptorInstance(interceptor) {
    const isObject = interceptor.intercept
    if (isObject) {
      return interceptor
    }

    const instanceWrapper = this.getInstanceByMetatype(interceptor)
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
}

module.exports = InterceptorsContextCreator
