const RouterMethodFactory = require('../helpers/router-method-factory')
const SharedUtils = require('../../common/utils/shared.utils')

class KoaAdapter {
  /**
   * @param instance {KoaRouter} koa-router
   */
  constructor(instance) {
    this.instance = instance
    this.routerMethodFactory = new RouterMethodFactory()
    this.httpServer = null
  }

  use(...args) {
    return this.instance.use(...args)
  }

  get(...args) {
    return this.instance.get(...args)
  }

  listen(port, hostname, callback) {
    return this.instance.listen(port, hostname, callback)
  }

  reply(ctx, body, statusCode) {
    ctx.status = statusCode
    if (SharedUtils.isNil(body)) {
      ctx.body = {
        code: 0,
        msg: 'success',
        body: null
      }
    }

    ctx.body = {
      code: 0,
      msg: 'success',
      body
    }
  }

  setErrorHandler(handler) {
    return this.httpServer.use(handler)
  }

  setNotFoundHandler(handler) {
    return this.httpServer.use(handler)
  }

  setHeader(ctx, name, value) {
    return ctx.set(name, value)
  }

  getHttpServer() {
    return this.httpServer
  }

  setHttpServer(httpServer) {
    this.httpServer = httpServer
  }

  getInstance() {
    return this.instance
  }

  getRequestMethod(ctx) {
    return ctx.method
  }

  getRequestUrl(ctx) {
    return ctx.url
  }

  createMiddlewareFactory(requestMethod) {
    return this.routerMethodFactory
      .get(this.instance, requestMethod)
      .bind(this.instance)
  }
}

module.exports = KoaAdapter
