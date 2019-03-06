const Controller = require('../../src/common/decorators/core/controller.decorator')
const Dependencies = require('../../src/common/decorators/core/dependencies.decorator')
const Inject = require('../../src/common/decorators/core/inject.decorator')
const Header = require('../../src/common/decorators/http/header.decorator')
const {
  Param
} = require('../../src/common/decorators/http/route-params.decorator')
const {
  Get
} = require('../../src/common/decorators/http/request-mapping.descorator')

const UsePipes = require('../../src/common/decorators/core/use-pipes.decorator')
const UseGuards = require('../../src/common/decorators/core/use-guards.decorator')
const UseInterceptors = require('../../src/common/decorators/core/use-interceptors.decorator')

const AppGuard = require('./appGuard')
const AppPipe = require('./appPipe')
const AppInterceptor = require('./appInterceptor')

const AppService = require('./appService')

@Controller('hello')
@Dependencies(AppService)
class AppController {
  @Inject(AppService)
  appService

  @UseInterceptors(new AppInterceptor())
  @UseGuards(new AppGuard())
  @UsePipes(new AppPipe())
  @Get('/1')
  @Header('Author', 'xiaows')
  @Param('id', 2)
  getHello(id, a, b) {
    return this.appService.getHello(b)
  }
}

module.exports = AppController
