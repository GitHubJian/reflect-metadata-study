const Utils = require('./utils')

class MiddlewareBuilder {
  constructor(routesMapper) {
    this.routesMapper = routesMapper
    this.middlewareCollection = new Set()
  }
}

MiddlewareBuilder.ConfigProxy = class {
  constructor(builder, middleware) {
    this.builder = builder
    this.contextParameters = null
    this.excludedRoutes = []
    this.includedRoutes = Utils.filterMiddleware(middleware)
  }
}

module.exports = MiddlewareBuilder
