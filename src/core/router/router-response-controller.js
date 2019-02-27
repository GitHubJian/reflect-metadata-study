const RequestMethodEnum = require('../../common/enums/request-method.enum')
const HttpStatusEnum = require('../../common/enums/http-status.enum')
const SharedUtils = require('../../common/utils/shared.utils')

class RouterResponseController {
  constructor(applicationRef) {
    this.applicationRef = applicationRef
  }

  async apply(resultOrDeffered, ctx, httpStatusCode) {
    const result = await this.transformToResult(resultOrDeffered)
    return this.applicationRef.reply(ctx, result, httpStatusCode)
  }

  async transformToResult(resultOrDeffered) {
    if (
      resultOrDeffered &&
      SharedUtils.isFunction(resultOrDeffered.subscribe)
    ) {
      return resultOrDeffered.toPromise()
    }

    return resultOrDeffered
  }

  getStatusByMethod(requestMethod) {
    switch (requestMethod) {
      case RequestMethodEnum.POST:
        return HttpStatusEnum.CREATED
      default:
        return HttpStatusEnum.OK
    }
  }

  setHeaders(ctx, headers) {
    headers.forEach(({ name, value }) => {
      this.applicationRef.setHeader(ctx, name, value)
    })
  }
}

module.exports = RouterResponseController
