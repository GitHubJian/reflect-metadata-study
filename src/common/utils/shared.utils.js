module.exports = {
  isUndefined: obj => typeof obj === 'undefined',
  isFunction: fn => typeof fn === 'function',
  isObject: fn => {
    return (
      !(typeof obj === 'undefined' || obj === null) && typeof fn === 'object'
    )
  },
  isString: fn => typeof fn === 'string',
  isConstructor: fn => fn === 'constructor',
  validatePath: path =>
    path ? (path.charAt(0) !== '/' ? '/' + path : path) : '',
  isNil: obj => {
    return typeof obj === 'undefined' || obj === null
  },
  isEmpty: array => !(array && array.length > 0),
  isSymbol: fn => typeof fn === 'symbol'
}
