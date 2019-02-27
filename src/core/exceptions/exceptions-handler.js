const BaseExceptionFilter = require('./base-exception-filter')
const InvalidExceptionFilterException = require('../errors/exceptions/invalid-exception-filter.exception')
const SharedUtils = require('../../common/utils/shared.utils')

class ExceptionsHandler extends BaseExceptionFilter {
  constructor() {
    super(...arguments)
    this.filters = []
  }

  next(exception, ctx) {
    if (this.invokeCustomFilters(exception, ctx)) {
      return
    }

    super.catch(exception, ctx)
  }

  setCustomFilters(filters) {
    if (!Array.isArray(filters)) {
      throw new InvalidExceptionFilterException()
    }

    this.filters = filters
  }

  invokeCustomFilters(exception, response) {
    if (SharedUtils.isEmpty(this.filters)) {
      return false
    }

    const filter = this.filters.find(({ exceptionMetatypes }) => {
      const hasMetatype =
        !exceptionMetatypes.length ||
        exceptionMetatypes.some(
          ExceptionMetatype => exception instanceof ExceptionMetatype
        )

      return hasMetatype
    })

    filter && filter.func(exception, response)
    return !!filter
  }
}

module.exports = ExceptionsHandler
