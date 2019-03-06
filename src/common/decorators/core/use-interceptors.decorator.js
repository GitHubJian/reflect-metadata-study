const SharedUtils = require('../../utils/shared.utils')
const ValidateEachUtil = require('../../utils/validate-each.util')
const ExtendMetadataUtil = require('../../utils/extend-metadata.util')
const Constanst = require('../../constants')

function UseInterceptors(...interceptors) {
  return (target, key, descriptor) => {
    const isValidInterceptor = interceptor =>
      interceptor &&
      (SharedUtils.isFunction(interceptor) ||
        SharedUtils.isFunction(interceptor.intercept))

    if (descriptor) {
      ValidateEachUtil(
        target.constructor,
        interceptors,
        isValidInterceptor,
        '@UseInterceptors',
        'interceptor'
      )

      ExtendMetadataUtil(
        Constanst.INTERCEPTORS_METADATA,
        interceptors,
        descriptor.value
      )

      return descriptor
    }

    ValidateEachUtil(
      target,
      interceptors,
      isValidInterceptor,
      '@UseInterceptors',
      'interceptor'
    )
    ExtendMetadataUtil(Constanst.INTERCEPTORS_METADATA, interceptors, target)

    return target
  }
}

module.exports = UseInterceptors
