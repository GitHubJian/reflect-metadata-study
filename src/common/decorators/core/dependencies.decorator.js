const Constants = require('../../constants')
const FlattenUtil = require('../../utils/flatten.util')

function Dependencies(...dependencies) {
  const flattenDeps = FlattenUtil(dependencies)
  return function(target) {
    Reflect.defineMetadata(Constants.PARAMTYPES_METADATA, flattenDeps, target)
  }
}

module.exports = Dependencies
