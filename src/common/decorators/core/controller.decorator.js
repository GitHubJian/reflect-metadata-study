const SharedUtils = require('../../utils/shared.utils')
const Constants = require('../../constants')

function Controller(prefix) {
  const path = SharedUtils.isUndefined(prefix) ? '/' : prefix

  return target => {
    Reflect.defineMetadata(Constants.PATH_METADATA, path, target)
  }
}

module.exports = Controller
