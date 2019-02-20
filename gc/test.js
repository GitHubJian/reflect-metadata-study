require('reflect-metadata')
const sharedUtils = require('./shareUtils')
const constants = {
  PROPERTY_DEPS_METADATA: 'self:properties_metadata',
  PARAMTYPES_METADATA: 'design:paramtypes',
  SELF_DECLARED_DEPS_METADATA: 'self:paramtypes'
}

function Injectable() {
  return target => {}
}

function flatten(arr) {
  const flat = [].concat(...arr)
  return flat.some(Array.isArray) ? flatten(flat) : flat
}

function Dependencies(...dependencies) {
  const flattenDeps = flatten(dependencies)
  return function(target) {
    Reflect.defineMetadata(constants.PARAMTYPES_METADATA, flattenDeps, target)
  }
}

function Inject(token) {
  return function(target, key, index) {
    token = token || Reflect.getMetadata('design:type', target, key)
    const type = token && sharedUtils.isFunction(token) ? token.name : token
    if (!sharedUtils.isUndefined(index)) {
      let dependencies =
        Reflect.getMetadata(constants.SELF_DECLARED_DEPS_METADATA, target) || []

      dependencies = [...dependencies, { index, param: type }]
      Reflect.defineMetadata(
        constants.SELF_DECLARED_DEPS_METADATA,
        dependencies,
        target
      )

      return
    }

    let properties =
      Reflect.getMetadata(
        constants.PROPERTY_DEPS_METADATA,
        target.constructor
      ) || []
    properties = [...properties, { key, type }]
    Reflect.defineMetadata(
      constants.PROPERTY_DEPS_METADATA,
      properties,
      target.constructor
    )
  }
}

class OtherService {
  constructor() {
    this.a = 1
  }
}

class OtherService2 {
  constructor() {
    this.b = 2
  }
}

function RequestMapping(metadata){
  const pathMetada
}

function createMappingDecorator(method) {
  return function(path) {

  }
}

function Get() {}

@Injectable()
@Dependencies(OtherService, OtherService2)
class TestService {
  constructor(otherService, otherService2) {
    this.otherService = otherService
    this.otherService2 = otherService2
  }

  @Get()
  testMethod() {
    console.log(this.otherService.a)
    console.log(this.otherService2.b)
  }
}

const Factory = target => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata(constants.PARAMTYPES_METADATA, target) // [OtherService]
  const args = providers.map(provider => new provider())
  return new target(...args)
}

module.exports = { TestService, Factory }
