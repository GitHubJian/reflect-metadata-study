const ParamsTokenFactory = require('./params-token-factory')

class PipesConsumer {
  constructor() {
    this.paramsTokenFactory = new ParamsTokenFactory()
  }

  async apply(value, { metatype, type, data }, transforms) {
    const token = this.paramsTokenFactory.exchangeEnumForString(type)

    return this.applyPipes(value, { metatype, type: token, data }, transforms)
  }

  async applyPipes(value, { metatype, type, data }, transforms) {
    return transforms.reduce(async (defferedValue, fn) => {
      const val = await defferedValue
      const result = fn(val, { metatype, type, data })

      return result
    }, Promise.resolve(value))
  }
}

module.exports = PipesConsumer
