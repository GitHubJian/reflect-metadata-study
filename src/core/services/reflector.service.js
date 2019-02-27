class Reflector {
  get(metadataKey, target) {
    return Reflect.getMetadata(metadataKey, target)
  }
}

module.exports = Reflector
