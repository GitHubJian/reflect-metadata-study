const Constants = require('../../constants')
const RouteParamtypesEnum = require('../../enums/route-paramtypes.enum')
const SharedUtils = require('../../utils/shared.utils')

function assignMetadata(args, paramtype, index, data, ...pipes) {
  return Object.assign({}, args, {
    [`${paramtype}:${index}`]: {
      index,
      data,
      pipes
    }
  })
}

function createRouteParamDecorator(paramtype) {
  return function(data) {
    return function(target, key, index) {
      const args =
        Reflect.getMetadata(
          Constants.ROUTE_ARGS_METADATA,
          target.constructor,
          key
        ) || {}

      Reflect.defineMetadata(
        Constants.ROUTE_ARGS_METADATA,
        assignMetadata(args, paramtype, index, data),
        target.constructor,
        key
      )
    }
  }
}

function createPipesRouteParamDecorator(paramtype, index) {
  return function(data, ...pipes) {
    return function(target, key, descriptor) {
      const args =
        Reflect.getMetadata(
          Constants.ROUTE_ARGS_METADATA,
          target.constructor,
          key
        ) || {}
      const hasParamData = SharedUtils.isNil(data) || SharedUtils.isString(data)
      const paramData = hasParamData ? data : undefined
      const paramPipes = hasParamData ? pipes : [data, ...pipes]
      Reflect.defineMetadata(
        Constants.ROUTE_ARGS_METADATA,
        assignMetadata(args, paramtype, index, paramData, ...paramPipes),
        target.constructor,
        key
      )
    }
  }
}

function Query(property, ...pipes) {
  return createPipesRouteParamDecorator(RouteParamtypesEnum.QUERY)(
    property,
    ...pipes
  )
}

function Body(property, ...pipes) {
  return createPipesRouteParamDecorator(RouteParamtypesEnum.BODY)(
    property,
    ...pipes
  )
}

function Param(property, index, ...pipes) {
  return createPipesRouteParamDecorator(RouteParamtypesEnum.PARAM, index)(
    property,
    ...pipes
  )
}

module.exports = {
  Request: createRouteParamDecorator(RouteParamtypesEnum.REQUEST),
  Query,
  Body,
  Param
}
