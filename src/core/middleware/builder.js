const Utils = require('./utils')
const SharedUtils = require('../../common/utils/shared.utils')
const flatten = require('../../common/utils/flatten.util')
const BindResolveMiddlewareValuesUtil = require('../../common/utils/bind-resolve-values.util')
const RequestMethodEnum = require('../../common/enums/request-method.enum')

class MiddlewareBuilder {
  constructor(routesMapper) {
    this.routesMapper = routesMapper
    this.middlewareCollection = new Set()
  }

  apply(...middleware) {
    debugger
    return new MiddlewareBuilder.ConfigProxy(this, flatten(middleware))
  }

  build() {
    return [...this.middlewareCollection]
  }

  bindValuesToResolve(middleware, resolveParams) {
    if (SharedUtils.isNil(resolveParams)) {
      return middleware
    }
    const bindArgs = BindResolveMiddlewareValuesUtil(resolveParams)

    return [].concat(middleware).map(bindArgs)
  }
}

MiddlewareBuilder.ConfigProxy = class {
  constructor(builder, middleware) {
    this.builder = builder
    this.contextParameters = null
    this.excludedRoutes = []
    this.includedRoutes = Utils.filterMiddleware(middleware)
  }

  getExcludedRoutes() {
    return this.excludedRoutes
  }

  with(...args) {
    this.contextParameters = args
    return this
  }

  exclude(...routes) {
    const { routesMapper } = this.builder
    this.excludedRoutes = this.mapRoutesToFlatList(
      routes.map(route => routesMapper.mapRouteToRouteInfo(route))
    )
    return this
  }

  forRoutes(...routes) {
    debugger
    const {
      middlewareCollection,
      bindValuesToResolve,
      routesMapper
    } = this.builder
    const forRoutes = this.mapRoutesToFlatList(
      routes.map(route => routesMapper.mapRouteToRouteInfo(route))
    )
    const configuration = {
      middleware: bindValuesToResolve(
        this.includedRoutes,
        this.contextParameters
      ),
      forRoutes: forRoutes.filter(route => !this.isRouteExcluded(route))
    }
    middlewareCollection.add(configuration)
    
    return this.builder
  }

  mapRoutesToFlatList(forRoutes) {
    return forRoutes.reduce((a, b) => a.concat(b))
  }

  isRouteExcluded(routeInfo) {
    const pathLastIndex = routeInfo.path.length - 1
    const validatedRoutePath =
      routeInfo.path[pathLastIndex] === '/'
        ? routeInfo.path.slice(0, pathLastIndex)
        : routeInfo.path
    return this.excludedRoutes.some(excluded => {
      const isPathEqual = validatedRoutePath === excluded.path
      if (!isPathEqual) {
        return false
      }
      return (
        routeInfo.method === excluded.method ||
        excluded.method === RequestMethodEnum.ALL
      )
    })
  }
}

module.exports = MiddlewareBuilder
