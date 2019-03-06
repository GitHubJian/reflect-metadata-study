const ExecutionContextHost = require('../helpers/execution-context.host')

class RouterProxy {
  createProxy(targetCallback, exceptionsHandler) {
    // koa-router 接口
    return async (ctx, next) => {
      try {
        await targetCallback(ctx, next)
      } catch (e) {
        const host = new ExecutionContextHost(ctx)
        exceptionsHandler.next(e, host)
      }
    }
  }

  createExceptionLayerProxy(targetCallback, exceptionsHandler) {
    return async (err, ctx, next) => {
      try {
        await targetCallback(err, ctx, next)
      } catch (e) {
        const host = new ExecutionContextHost(ctx)
        exceptionsHandler.next(e, host)
      }
    }
  }
}

module.exports = RouterProxy
