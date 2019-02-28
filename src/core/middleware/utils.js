const SharedUtils = require('../../common/utils/shared.utils')
const uuid = require('uuid/v4')

function filterMiddleware(middleware) {
  return []
    .concat(middleware)
    .filter(SharedUtils.isFunction)
    .map(exports.mapToClass)
}

function mapToClass(middleware) {
  if (isClass(middleware)) {
    return middleware
  }

  return assignToken(
    class {
      constructor() {
        this.resolve = (...args) => (...params) => middleware(...params)
      }
    }
  )
}

function isClass(middleware) {
  return middleware.toString().substring(0, 5) === 'class'
}

function assignToken(metatype) {
  Object.defineProperty(metatype, 'name', { value: uuid() })

  return metatype
}

module.exports = {
  filterMiddleware,
  mapToClass,
  isClass,
  assignToken
}
