const Module = require('../../src/common/decorators/modules/module.decorator')
const AppController = require('./appController')
const AppService = require('./appService')

@Module({
  providers: [AppService],
  controllers: [AppController]
})
class AppModule {
  configure(consumer) {
    // consumer.apply()
  }
}

module.exports = AppModule
