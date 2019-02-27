const Controller = require('../../src/common/decorators/core/controller.decorator')

const {
  Get
} = require('../../src/common/decorators/http/request-mapping.descorator')

@Controller('app')
class AppController {
  constructor() {}

  @Get()
  findStudent() {
    console.log(123)
  }
}

module.exports = AppController
