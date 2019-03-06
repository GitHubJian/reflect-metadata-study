const Constants = require('../../constants')
const ExtendMetadataUtil = require('../../utils/extend-metadata.util')

function Header(name, value) {
  return function(target, key, descriptor) {
    ExtendMetadataUtil(
      Constants.HEADERS_METADATA,
      [{ name, value }],
      descriptor.value
    )

    return descriptor
  }
}

module.exports = Header
