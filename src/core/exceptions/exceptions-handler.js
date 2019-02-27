const BaseExceptionFilter = require('./base-exception-filter')
const InvalidExceptionFilterException = 

class ExceptionsHanlder extends BaseExceptionFilter {
  constructor() {
    super(...arguments)
    this.filters = []
  }

  setCustomFilters(filters) {
    if (!Array.isArray(filters)) {
      throw new InvalidExceptionFilterException()
    }

    this.filters = filters
  }
}

module.exports = ExceptionsHanlder
