const SharedUtils = require('../../common/utils/shared.utils')
const ExecutionContextHost = require('../helpers/execution-context.host')
const Rxjs = require('rxjs')
const Operators = require('rxjs/operators')

class InterceptorsConsumer {
  async intercept(interceptors, args, instance, callback, next) {
    if (SharedUtils.isEmpty(interceptors)) {
      return next()
    }

    const context = this.createContext(args, instance, callback)
    const start$ = Rxjs.defer(() => this.transformDeffered(next))

    const result$ = await interceptors.reduce(
      async (stream$, interceptor) =>
        interceptor.intercept(context, await stream$),
      Promise.resolve(start$)
    )

    return result$.toPromise()
  }

  createContext(args, instance, callback) {
    return new ExecutionContextHost(args, instance.constructor, callback)
  }

  transformDeffered(next) {
    return Rxjs.from(next()).pipe(
      Operators.switchMap(res => {
        const isDeffered =
          res instanceof Promise || res instanceof Rxjs.Observable
        return isDeffered ? res : Promise.resolve(res)
      })
    )
  }
}

module.exports = InterceptorsConsumer
