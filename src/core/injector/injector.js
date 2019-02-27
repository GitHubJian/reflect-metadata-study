const SharedUitls = require('../../common/utils/shared.utils')
const Constants = require('../../common/constants')
const RuntimeException = require('../errors/exceptions/runtime.exception')
const UndefinedDependencyException = require('../errors/exceptions/undefined-dependency.exception')

class Injector {
  async loadInstanceOfMiddleware() {}

  async loadInstanceOfRoute(wrapper, module) {
    const routes = module.routes
    await this.loadInstance(wrapper, routes, module)
  }

  async loadInstanceOfInjectable(wrapper, module) {
    const injectables = module.injectables
    await this.loadInstance(wrapper, injectables, module)
  }

  loadPrototypeOfInstance({ metatype, name }, collection) {
    if (!collection) {
      return null
    }

    const target = collection.get(name)
    if (
      target.isResolved ||
      !SharedUitls.isNil(target.inject) ||
      !metatype.prototype
    ) {
      return null
    }

    collection.set(
      name,
      Object.assign({}, collection.get(name), {
        instance: Object.create(metatype.prototype)
      })
    )
  }

  async loadInstanceOfComponent(wrapper, module) {
    const components = module.components
    await this.loadInstance(wrapper, components, module)
  }

  applyDoneHook(wrapper) {
    let done
    wrapper.done$ = new Promise((resolve, reject) => {
      done = resolve
    })
    wrapper.isPending = true

    return done
  }

  async loadInstance(wrapper, collection, module) {
    if (wrapper.isPending) {
      return wrapper.done$
    }
    const done = this.applyDoneHook(wrapper)
    const { name, inject } = wrapper
    const targetWrapper = collection.get(name)
    if (SharedUitls.isUndefined(targetWrapper)) {
      throw new RuntimeException()
    }
    if (targetWrapper.isResolved) {
      return
    }

    const callback = async instances => {
      const properties = await this.resolveProperties(wrapper, module, inject)
      const instance = await this.instantiateClass(
        instances,
        wrapper,
        targetWrapper
      )

      this.applyProperties(instance, properties)

      done()
    }

    await this.resolveConstructorParams(wrapper, module, inject, callback)
  }

  async resolveConstructorParams(wrapper, module, inject, callback) {
    const dependencies = SharedUitls.isNil(inject)
      ? this.reflectConstructorParams(wrapper.metatype)
      : inject
    let isResolved = true
    const instances = await Promise.all(
      dependencies.map(async (param, index) => {
        try {
          const paramWrapper = await this.resolveSingleParam(
            wrapper,
            param,
            { index, dependencies },
            module
          )

          if (!paramWrapper.isResolved) {
            isResolved = false
          }

          return paramWrapper.instance
        } catch (e) {
          console.error(e)
          console.error(e.stack)

          return undefined
        }
      })
    )
    isResolved && (await callback(instances))
  }

  reflectConstructorParams(type) {
    const paramtypes =
      Reflect.getMetadata(Constants.PARAMTYPES_METADATA, type) || []
    const selfParams = this.reflectSelfParams(type)
    selfParams.forEach(({ index, param }) => (paramtypes[index] = param))

    return paramtypes
  }

  reflectSelfParams(type) {
    return (
      Reflect.getMetadata(Constants.SELF_DECLARED_DEPS_METADATA, type) || []
    )
  }

  async resolveSingleParam(wrapper, param, dependencyContext, module) {
    if (SharedUitls.isUndefined(param)) {
      throw new UndefinedDependencyException(
        wrapper.name,
        dependencyContext,
        module
      )
    }

    const token = this.resolveParamToken(wrapper, param)

    return await this.resolveComponentInstance(
      module,
      SharedUitls.isFunction(token) ? token.name : token,
      dependencyContext,
      wrapper
    )
  }

  resolveParamToken(wrapper, param) {
    return param
  }

  async resolveComponentInstance(module, name, dependencyContext, wrapper) {
    const components = module.components
    const instanceWrapper = await this.lookupComponent(
      components,
      module,
      Object.assign({}, dependencyContext, { name }),
      wrapper
    )

    return instanceWrapper
  }

  async lookupComponent(components, module, dependencyContext, wrapper) {
    const { name } = dependencyContext
    return components.get(name)
  }

  async resolveProperties(wrapper, module, inject) {
    if (!SharedUitls.isNil(inject)) {
      return []
    }
    const properties = this.reflectProperties(wrapper.metatype)
    const instances = await Promise.all(
      properties.map(async item => {
        try {
          const dependencyContext = {
            key: item.key,
            name: item.name
          }

          const paramWrapper = await this.resolveSingleParam(
            wrapper,
            item.name,
            dependencyContext,
            module
          )

          return (paramWrapper && paramWrapper.instance) || undefined
        } catch (err) {
          return undefined
        }
      })
    )

    return properties.map((item, index) =>
      Object.assign({}, item, { instance: instances[index] })
    )
  }

  reflectProperties(type) {
    const properties =
      Reflect.getMetadata(Constants.PROPERTY_DEPS_METADATA, type) || []

    return properties.map(item =>
      Object.assign({}, item, {
        name: item.type
      })
    )
  }

  applyProperties(instance, properties) {
    if (!SharedUitls.isObject(instance)) {
      return undefined
    }

    properties
      .filter(item => !SharedUitls.isNil(item.instance))
      .forEach(item => (instance[item.key] = item.instance))
  }

  async instantiateClass(instances, wrapper, targetMetatype) {
    const { metatype, inject } = wrapper
    if (SharedUitls.isNil(inject)) {
      targetMetatype.instance = new metatype(...instances)
    } else {
      const factoryResult = targetMetatype.metatype(...instances)
      targetMetatype.instance = await factoryResult
    }

    targetMetatype.isResolved = true
    return targetMetatype.instance
  }
}

module.exports = Injector
