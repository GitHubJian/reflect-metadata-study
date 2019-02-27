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

  useGlobalPipes(...pipes) {
    this.globalPipes = this.globalPipes.concat(pipes)
  }

  getGlobalFilters() {
    return this.globalFilters
  }

  addGlobalFilter(filter) {
    this.globalFilters.push(filter)
  }

  useGlobalFilters(...filters) {
    this.globalFilters = this.globalFilters.concat(filters)
  }

  getGlobalPipes() {
    return this.globalPipes
  }

  getGlobalInterceptors() {
    return this.globalInterceptors
  }

  addGlobalInterceptor(interceptor) {
    this.globalInterceptors.push(interceptor)
  }

  useGlobalInterceptors(...interceptors) {
    this.globalInterceptors = this.globalInterceptors.concat(interceptors)
  }

  getGlobalGuards() {
    return this.globalGuards
  }

  addGlobalGuard(guard) {
    this.globalGuards.push(guard)
  }

  useGlobalGuards(...guards) {
    this.globalGuards = this.globalGuards.concat(guards)
  }
}

module.exports = ApplicationConfig
