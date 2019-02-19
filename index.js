require('reflect-metadata')
const { metadataKey, metadataValue } = require('./constants')

class C {
  @Reflect.metadata(metadataKey, metadataValue)
  method() {}
}

module.exports = C
