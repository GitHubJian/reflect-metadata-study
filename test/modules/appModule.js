const Module = require('../../src/common/decorators/modules/module.decorator')
const controller = require('../controller')

@Module({
  controllers: []
})
class AppModule {}

module.exports = AppModule
