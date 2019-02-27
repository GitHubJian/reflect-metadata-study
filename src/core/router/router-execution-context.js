const Constants = require('../../common/constants')
const ContextUtils = require('../helpers/context-utils')
const RouterResponseController = require('./router-response-controller')
const SharedUtils = require('../../common/utils/shared.utils')
const RouteParamtypesEnum = require('../../common/enums/route-paramtypes.enum')

class RouterExecutionContext {
  constructor(
    paramsFactory,
    pipesContextCreator,
    pipesConsumer,
    interceptorsContextCreator,
    interceptorsConsumer,
    applicationRef
  ) {
    this.paramsFactory = paramsFactory
    this.pipesContextCreator = pipesContextCreator
    this.pipesConsumer = pipesConsumer
    this.interceptorsContextCreator = interceptorsContextCreator
    this.interceptorsConsumer = interceptorsConsumer
    this.applicationRef = applicationRef
    this.contextUtils = new ContextUtils()
    this.responseController = new RouterResponseController(applicationRef)
  }

  create(instance, callback, methodName, module, requestMethod) {
    const metadata =
      this.contextUtils.reflectCallbackMetadata(
        instance,
        methodName,
        Constants.ROUTE_ARGS_METADATA
      ) || {}
    const keys = Object.keys(metadata)
    const argsLength = this.contextUtils.getArgumentsLength(keys, metadata)
    const pipes = this.pipesContextCreator.create(instance, callback, module)
    const paramtypes = this.contextUtils.reflectCallbackParamtypes(
      instance,
      methodName
    )
    // const guards = this.guardsContextCreator.create(instance, callback, module)
    const interceptors = this.interceptorsContextCreator.create(
      instance,
      callback,
      module
    )
    const httpCode = this.reflectHttpStatusCode(callback)
    const paramsMetadata = this.exchangeKeysForValues(keys, metadata, module)
    const isResponseHandled = paramsMetadata.some(
      ({ type }) =>
        type === RouteParamtypesEnum.RESPONSE ||
        type === RouteParamtypesEnum.NEXT
    )
    const paramsOptions = this.contextUtils.mergeParamsMetatypes(
      paramsMetadata,
      paramtypes
    )
    const httpStatusCode = httpCode
      ? httpCode
      : this.responseController.getStatusByMethod(requestMethod)
    // const fnCanActivate = this.createGuardsFn(guards, instance, callback)
    const fnApplyPipes = this.createPipesFn(pipes, paramsOptions)
    const fnHandleResponse = this.createHandleResponseFn(
      callback,
      isResponseHandled,
      httpStatusCode
    )
    const handler = (args, ctx, next) => async () => {
      fnApplyPipes && (await fnApplyPipes(args, ctx, next))
      return callback.apply(instance, args)
    }
    debugger
    return async (ctx, next) => {
      debugger
      const args = this.contextUtils.createNullArray(argsLength)
      const result = await this.interceptorsConsumer.intercept(
        interceptors,
        ctx,
        instance,
        callback,
        handler(args, ctx, next)
      )
      await fnHandleResponse(result, ctx)
    }
  }

  reflectHttpStatusCode(callback) {
    return Reflect.getMetadata(Constants.HTTP_CODE_METADATA, callback)
  }

  reflectResponseHeaders(callback) {
    return Reflect.getMetadata(Constants.HEADERS_METADATA, callback) || []
  }

  exchangeKeysForValues(keys, metadata, moduleContext) {
    this.pipesContextCreator.setModuleContext(moduleContext)
    return keys.map(key => {
      const { index, data } = metadata[key]
      const type = this.contextUtils.mapParamType(key)

      const numericType = Number(type)
      const extractValue = (ctx, next) =>
        this.paramsFactory.exchangeKeyForValue(numericType, data, {
          ctx,
          next
        })
      return { index, extractValue, type: numericType, data }
    })
  }

  async getParamValue(value, { metatype, type, data }, transforms) {
    if (
      type === RouteParamtypesEnum.BODY ||
      type === RouteParamtypesEnum.QUERY ||
      type === RouteParamtypesEnum.PARAM ||
      SharedUtils.isString(type)
    ) {
      return this.pipesConsumer.apply(
        value,
        { metatype, type, data },
        transforms
      )
    }

    return Promise.resolve(value)
  }

  createPipesFn(pipes, paramsOptions) {
    const pipesFn = async (args, ctx, next) => {
      await Promise.all(
        paramsOptions.map(async param => {
          const {
            index,
            extractValue,
            type,
            data,
            metatype,
            pipes: paramPipes
          } = param
          debugger
          const value = extractValue(ctx, next)
          args[index] = await this.getParamValue(
            value,
            { metatype, type, data },
            pipes.concat(paramPipes)
          )
          debugger
        })
      )
    }

    return paramsOptions.length ? pipesFn : null
  }

  createHandleResponseFn(callback, isResponseHandled, httpStatusCode) {
    const responseHeaders = this.reflectResponseHeaders(callback)
    const hasCustomHeaders = !SharedUtils.isEmpty(responseHeaders)

    return async (result, ctx) => {
      hasCustomHeaders &&
        this.responseController.setHeaders(ctx, responseHeaders)
      !isResponseHandled &&
        (await this.responseController.apply(result, ctx, httpStatusCode))
    }
  }
}

module.exports = RouterExecutionContext
