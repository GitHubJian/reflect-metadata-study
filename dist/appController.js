const Dependencies = require('./core/dependencies.decorator')
const AppService = require('./appService')

@
@Dependencies(AppService)
class AppController{
  constructor(appService){
    this.appService = appService
  }

  @
}