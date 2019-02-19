class ApplicationConfig {
  constructor() {
    this.globalPipes = []
    this.globalFilters = []
    this.globalInterceptors = []
    this.globalGuards = []
    this.globalPrefix = ''
  }

  setGlobalPrefix(prefix) {
    this.globalPrefix = prefix
  }

  getGlobalPrefix() {
    return this.globalPrefix
  }

  addGlobalPipe(pipe) {
    this.globalPipes.push(pipe)
  }

  getGlobalPipes() {
    return this.globalPipes
  }

  useGlobalPipes(...pipes) {
    this.globalPipes = this.globalPipes.concat(pipes)
  }

  addGlobalFilter(filter) {
    this.globalFilters.push(filter)
  }

  getGlobalFilters() {
    return this.globalFilters
  }

  useGlobalFilters(...filters) {
    this.globalFilters = this.globalFilters.concat(filters)
  }

  addGlobalInterceptor(interceptor) {
    this.globalInterceptors.push(interceptor)
  }

  getGlobalInterceptors() {
    return this.globalInterceptors
  }

  useGlobalInterceptors(...interceptors) {
    this.globalInterceptors = this.globalInterceptors.concat(interceptors)
  }

  addGlobalGuard(guard) {
    this.globalGuards.push(guard)
  }

  getGlobalGuards() {
    return this.globalGuards
  }

  useGlobalGuards(...guards) {
    this.globalGuards = this.globalGuards.concat(guards)
  }
}

module.exports = ApplicationConfig
