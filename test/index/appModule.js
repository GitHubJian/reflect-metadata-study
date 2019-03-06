const Module = require('../../src/common/decorators/modules/module.decorator')
const ModuleImplement = require('../../src/common/implements/module.implement')
const AppController = require('./appController')
const AppService = require('./appService')
const AppMiddleware = require('./appMiddleware')
const RequestMethodEnum = require('./../../src/common/enums/request-method.enum')

@Module({
  providers: [AppService],
  controllers: [AppController]
})
class AppModule extends ModuleImplement {
  configure(consumer) {
    consumer
      .apply(AppMiddleware)
      .forRoutes({ path: '/hello/*', method: RequestMethodEnum.GET })
  }
}

module.exports = AppModule
