const BaseExceptionFilterContext = require('../exceptions/base-exception-filter-context')
const ExceptionsHandler = require('../exceptions/exceptions-handler')
const Constants = require('../../common/constants')
const SharedUtils = require('../../common/utils/shared.utils')

class RouterExceptionFilters extends BaseExceptionFilterContext {
  constructor(container, config, applicationRef) {
    super(container)
    this.config = config
    this.applicationRef = applicationRef
  }

  create(instance, callback, module) {
    this.moduleContext = module
    const exceptionHandler = new ExceptionsHandler(this.applicationRef)
    const filters = this.createContext(
      instance,
      callback,
      Constants.EXCEPTION_FILTERS_METADATA
    )
    if (SharedUtils.isEmpty(filters)) {
      return exceptionHandler
    }

    exceptionHandler.setCustomFilters(filters.reverse())

    return exceptionHandler
  }
}

module.exports = RouterExceptionFilters
