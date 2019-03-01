const deprecate = require('deprecate')
const uuid = require('uuid/v4')

function Injectable() {
  return target => {}
}

function Component() {
  deprecate(
    'The @Component() decorator is deprecated and will be removed within next major release. Use @Injectable() instead.'
  )
  return target => {}
}

function Pipe() {
  deprecate(
    'The @Pipe() decorator is deprecated and will be removed within next major release. Use @Injectable() instead.'
  )
  return target => {}
}

function Guard() {
  deprecate(
    'The @Guard() decorator is deprecated and will be removed within next major release. Use @Injectable() instead.'
  )
  return target => {}
}

function Middleware() {
  deprecate(
    'The @Middleware() decorator is deprecated and will be removed within next major release. Use @Injectable() instead.'
  )
  return target => {}
}

function Interceptor() {
  deprecate(
    'The @Interceptor() decorator is deprecated and will be removed within next major release. Use @Injectable() instead.'
  )
  return target => {}
}

function mixin(mixinClass) {
  Object.defineProperty(mixinClass, 'name', {
    value: uuid()
  })
  Injectable()(mixinClass)
  return mixinClass
}

module.exports = {
  Injectable,
  Component,
  Pipe,
  Guard,
  Middleware,
  Interceptor,
  mixin
}
