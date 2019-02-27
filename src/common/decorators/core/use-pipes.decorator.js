const SharedUtils = require('../../utils/shared.utils')
const ExtendMetadataUtil = require('../../utils/extend-metadata.util')
const Constants = require('../../constants')
const ValidateEachUtil = require('../../utils/validate-each.util')

function UsePipes(...pipes) {
  return (target, key, descriptor) => {
    const isPipeValid = pipe =>
      pipe &&
      (SharedUtils.isFunction(pipe) || SharedUtils.isFunction(pipe.transform))

    if (descriptor) {
      ExtendMetadataUtil(Constants.PIPES_METADATA, pipes, descriptor.value)
      return descriptor
    }

    ValidateEachUtil(target, pipes, isPipeValid, '@UsePipes', 'pipe')
    ExtendMetadataUtil(Constants.PIPES_METADATA, pipes, target)

    return target
  }
}

module.exports = UsePipes
