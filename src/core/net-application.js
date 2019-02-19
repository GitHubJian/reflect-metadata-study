const NetApplicationContext = require('./net-application-context')
const LoggerService = require('../common/services/logger.service')

class NetApplication extends NetApplicationContext {
  constructor(container, config, appOptions = {}) {
    super(container, [], null)
    this.config = config
    this.appOptions = appOptions
    this.logger = new LoggerService(NetApplication.name, true)

    this.isInitialized = false
    this.registerHttpServer()
  }

  registerHttpServer() {
    this.httpServer = this.createServer()
  }

  createServer() {
    const server = https.createServer(this.appOptions.httpsOptions, () => {
      console.log(123)
    })

    return server
  }
}

module.exports = NetApplication
