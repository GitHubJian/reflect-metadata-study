const RouterExplorer = require('../router/router-explorer')

class RoutesMapper {
  constructor(container) {
    this.routerExplorer = new RouterExplorer(container)
  }
}

module.exports = RoutesMapper
