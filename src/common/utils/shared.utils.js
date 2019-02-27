const isUndefined = obj => typeof obj === 'undefined'
const isNil = obj => isUndefined(obj) || obj === null
const isFunction = fn => typeof fn === 'function'
const isObject = fn => !isNil(fn) && typeof fn === 'object'
const isString = fn => typeof fn === 'string'
const isConstructor = fn => fn === 'constructor'
const validatePath = path =>
  path ? (path.charAt(0) !== '/' ? '/' + path : path) : ''
const isEmpty = array => !(array && array.length > 0)
const isSymbol = fn => typeof fn === 'symbol'

module.exports = {
  isUndefined,
  isNil,
  isFunction,
  isObject,
  isString,
  isConstructor,
  validatePath,
  isEmpty,
  isSymbol
}
