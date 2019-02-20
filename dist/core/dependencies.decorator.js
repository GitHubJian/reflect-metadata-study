function flatten(arr) {
  const flat = [].concat(...arr)
  return flat.some(Array.isArray) ? flatten(flat) : flat
}

function Dependencies(...dependencies) {
  const flattenDeps = flatten(dependencies)
  return function(target) {
    Reflect.defineMetadata(constants.PARAMTYPES_METADATA, flattenDeps, target)
  }
}

module.exports = Dependencies
