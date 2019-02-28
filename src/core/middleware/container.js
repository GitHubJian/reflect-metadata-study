class MiddlewareContainer {
  constructor() {
    this.middleware = new Map()
    this.configurationSets = new Map()
  }

  getMiddleware(module) {
    return this.middleware.get(module) || new Map()
  }
}

module.exports = MiddlewareContainer
