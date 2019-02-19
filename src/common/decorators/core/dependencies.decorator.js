const Constants = require('../../constants')

function flatten(arr) {
  const flat = [].concat(...arr)
  return flat.some(Array.isArray) ? flatten(flat) : flat
}

function Dependencies(...dependencies) {
  const flattenDeps = flatten(dependencies)
  return target => {
    Reflect.defineMetadata(Constants.PARAMTYPES_METADATA, flattenDeps, target)
  }
}

exports.flatten = flatten
module.exports = Dependencies
