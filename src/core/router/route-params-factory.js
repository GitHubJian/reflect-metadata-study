const RouteParamtypes = require('../../common/enums/route-paramtypes.enum')

class RouteParamsFactory {
  exchangeKeyForValue(key, data, { ctx, next }) {
    switch (key) {
      case RouteParamtypes.NEXT:
        return next
      case RouteParamtypes.REQUEST:
        return ctx.req
      case RouteParamtypes.RESPONSE:
        return ctx.res
      case RouteParamtypes.BODY:
        return data && ctx.req.body ? ctx.req.body[data] : ctx.req.body
      case RouteParamtypes.PARAM:
        return data ? ctx.params[data] : ctx.params
      case RouteParamtypes.QUERY:
        return data ? ctx.query[data] : ctx.query
      case RouteParamtypes.HEADERS:
        return data ? ctx.headers[data] : ctx.headers
      // case RouteParamtypes.SESSION:
      //   return req.session
      // case RouteParamtypes.FILE:
      //   return req[data || 'file']
      case RouteParamtypes.FILES:
        return ctx.req.body.files
      default:
        return null
    }
  }
}

module.exports = RouteParamsFactory
