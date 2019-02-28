const RouteParamtypesEnum = require('../../common/enums/route-paramtypes.enum')

class ParamsTokenFactory {
  exchangeEnumForString(type) {
    switch (type) {
      case RouteParamtypesEnum.BODY:
        return 'body'
      case RouteParamtypesEnum.PARAM:
        return 'param'
      case RouteParamtypesEnum.QUERY:
        return 'query'
      default:
        return 'custom'
    }
  }
}

module.exports = ParamsTokenFactory
