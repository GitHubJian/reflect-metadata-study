const RouterExplorer = require('../router/router-explorer')
const SharedUtils = require('../../common/utils/shared.utils')
const RequestMethodEnum = require('../../common/enums/request-method.enum')
const Constants = require('../../common/constants')
const MetadataScanner = require('../metadata-scanner')

class RoutesMapper {
  constructor(container) {
    this.routerExplorer = new RouterExplorer(new MetadataScanner(), container)
  }

  mapRouteToRouteInfo(route) {
    if (SharedUtils.isString(route)) {
      return [
        {
          path: this.validateRoutePath(route),
          method: RequestMethodEnum.ALL
        }
      ]
    }

    const routePath = Reflect.getMetadata(Constants.PATH_METADATA, route)
    if (this.isRouteInfo(routePath, route)) {
      return [
        {
          path: this.validateRoutePath(route.path),
          method: route.method
        }
      ]
    }

    const paths = this.routerExplorer.scanForPaths(
      Object.create(route),
      route.prototype
    )
    const concatPaths = (acc, currentValue) => acc.concat(currentValue)

    return paths
      .map(
        item =>
          item.path &&
          item.path.map(p => ({
            path:
              this.validateGlobalPath(routePath) + this.validateRoutePath(p),
            method: item.requestMethod
          }))
      )
      .reduce(concatPaths, [])
  }

  isRouteInfo(path, objectOrClass) {
    return SharedUtils.isUndefined(path)
  }

  validateGlobalPath(path) {
    const prefix = SharedUtils.validatePath(path)

    return prefix === '/' ? '' : prefix
  }

  validateRoutePath(path) {
    return SharedUtils.validatePath(path)
  }
}

module.exports = RoutesMapper
