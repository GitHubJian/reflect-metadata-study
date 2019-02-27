const Constants = require('../../constants')
const RequestMethodEnum = require('../../enums/request-method.enum')

const defaultMetadata = {
  [Constants.PATH_METADATA]: '/',
  [Constants.METHOD_METADATA]: RequestMethodEnum.GET
}

function RequestMapping(metadata = defaultMetadata) {
  const pathMetadata = metadata[Constants.PATH_METADATA]
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/'
  const requestMethod =
    metadata[Constants.METHOD_METADATA] || RequestMethodEnum.GET

  return function(target, key, descriptor) {
    Reflect.defineMetadata(Constants.PATH_METADATA, path, descriptor.value)
    Reflect.defineMetadata(
      Constants.METHOD_METADATA,
      requestMethod,
      descriptor.value
    )

    return descriptor
  }
}

function createMappingDecorator(method) {
  return function(path) {
    return RequestMapping({
      [Constants.PATH_METADATA]: path,
      [Constants.METHOD_METADATA]: method
    })
  }
}

const Get = createMappingDecorator(RequestMethodEnum.GET)
const Post = createMappingDecorator(RequestMethodEnum.POST)
const Put = createMappingDecorator(RequestMethodEnum.PUT)
const Delete = createMappingDecorator(RequestMethodEnum.DELETE)
const Patch = createMappingDecorator(RequestMethodEnum.PATCH)
const All = createMappingDecorator(RequestMethodEnum.ALL)
const Options = createMappingDecorator(RequestMethodEnum.OPTIONS)
const Head = createMappingDecorator(RequestMethodEnum.HEAD)

module.exports = {
  Get,
  Post,
  Put,
  Delete,
  Patch,
  All,
  Options,
  Head
}
