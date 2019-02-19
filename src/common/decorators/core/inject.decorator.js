const Constants = require('../../constants')
const SharedUtils = require('../../utils/shared.utils')

function Inject(token) {
  return (target, key, index) => {
    token = token || Reflect.getMetadata('design:type', target, key)
    const type = token && SharedUtils.isFunction(token) ? token.name : token
    if (!SharedUtils.isUndefined(index)) {
      let dependencies =
        Reflect.getMetadata(Constants.SELF_DECLARED_DEPS_METADATA, target) || []
      dependencies = [...dependencies, { index, param: type }]
      Reflect.defineMetadata(
        Constants.SELF_DECLARED_DEPS_METADATA,
        dependencies,
        target
      )
      return
    }
    let properties =
      Reflect.getMetadata(
        Constants.PROPERTY_DEPS_METADATA,
        target.constructor
      ) || []
    properties = [...properties, { key, type }]
    Reflect.defineMetadata(
      Constants.PROPERTY_DEPS_METADATA,
      properties,
      target.constructor
    )
  }
}

module.exports = {
  Inject
}
