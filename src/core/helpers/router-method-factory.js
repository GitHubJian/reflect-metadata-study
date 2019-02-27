const RequestMethodEnum = require('../../common/enums/request-method.enum')

class RouterMethodFactory {
  get(target, requestMethod) {
    switch (requestMethod) {
      case RequestMethodEnum.POST:
        return target.post
      case RequestMethodEnum.ALL:
        return target.use
      case RequestMethodEnum.DELETE:
        return target.delete
      case RequestMethodEnum.PUT:
        return target.put
      case RequestMethodEnum.PATCH:
        return target.patch
      case RequestMethodEnum.OPTIONS:
        return target.options
      case RequestMethodEnum.HEAD:
        return target.head
      default:
        return target.get
    }
  }
}

module.exports = RouterMethodFactory
