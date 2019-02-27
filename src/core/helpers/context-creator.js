class ContextCreator {
  createContext(instance, callback, metadataKey) {
    const classMetadata = this.reflectClassMetadata(instance, metadataKey)
    const methodMetadata = this.reflectMethodMetadata(callback, metadataKey)

    return [
      ...this.createConcreteContext(classMetadata),
      ...this.createConcreteContext(methodMetadata)
    ]
  }

  reflectClassMetadata(instance, metadataKey) {
    const prototype = Object.getPrototypeOf(instance)
    return Reflect.getMetadata(metadataKey, prototype.constructor)
  }

  reflectMethodMetadata(callback, metadataKey) {
    return Reflect.getMetadata(metadataKey, callback)
  }
}

module.exports = ContextCreator
