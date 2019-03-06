const Module = require('../../src/common/decorators/modules/module.decorator')
const ModuleImplement = require('../../src/common/implements/module.implement')
const CatsController = require('./catsController')
const CatsService = require('./catsService')

@Module({
  providers: [CatsService],
  controllers: [CatsController]
})
class CatsModule extends ModuleImplement {
  configure(consumer) {}
}

module.exports = CatsModule
