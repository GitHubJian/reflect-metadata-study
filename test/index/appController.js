const Controller = require('../../src/common/decorators/core/controller.decorator')
const Dependencies = require('../../src/common/decorators/core/dependencies.decorator')
const Inject = require('../../src/common/decorators/core/inject.decorator')
const Header = require('../../src/common/decorators/http/header.decorator')
const UsePipes = require('../../src/common/decorators/core/use-pipes.decorator')
const {
  Param
} = require('../../src/common/decorators/http/route-params.decorator')

const {
  Get
} = require('../../src/common/decorators/http/request-mapping.descorator')

const AppPipe = require('./appPipe')

const AppService = require('./appService')

@Controller('hello')
@Dependencies(AppService)
class AppController {
  @Inject(AppService)
  appService

  @Get(':id')
  @Header('Author', 'xiaows')
  @Param('id')
  @UsePipes(new AppPipe())
  getHello(id) {
    return this.appService.getHello()
  }
}

module.exports = AppController
