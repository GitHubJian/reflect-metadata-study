const Controller = require('../../src/common/decorators/core/controller.decorator')
const Dependencies = require('../../src/common/decorators/core/dependencies.decorator')
const CatsService = require('./catsService')

const Inject = require('../../src/common/decorators/core/inject.decorator')
const {
  Param
} = require('../../src/common/decorators/http/route-params.decorator')
const {
  Get
} = require('../../src/common/decorators/http/request-mapping.descorator')

@Controller('cats')
@Dependencies(CatsService)
class CatsController {
  @Inject(CatsService)
  catsService

  @Get(':id')
  @Param('id', 0)
  getCats(id) {
    return this.catsService.getCatById(id)
  }
}

module.exports = CatsController
