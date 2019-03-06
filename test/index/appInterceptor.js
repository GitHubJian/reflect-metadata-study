const { map, tap } = require('rxjs/operators')

class AppInterceptor {
  intercept(context, call$) {
    console.log('Before...')
    const now = Date.now()

    return call$.pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
    // return call$.pipe(
    //   map(value => {
    //     debugger
    //     return value === null ? '' : value
    //   })
    // )
  }
}

module.exports = AppInterceptor
