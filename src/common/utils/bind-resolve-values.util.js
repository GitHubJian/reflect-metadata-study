const ComponentDecorator = require('../decorators/core/component.decorator')

function BindResolveMiddlewareValues(data) {
  return Metatype => {
    const type = class extends Metatype {
      resolve() {
        return super.resolve(...data)
      }
    }
    const token = Metatype.name + JSON.stringify(data)
    Object.defineProperty(type, 'name', { value: token })
    ComponentDecorator.Injectable()(type)

    return type
  }
}

module.exports = BindResolveMiddlewareValues
