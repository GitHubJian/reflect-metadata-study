const SharedUtils = require('../../common/utils/shared.utils')
const ExecutionContextHost = require('../helpers/execution-context.host')
const Rxjs = require('rxjs')

class GuardsConsumer {
  async tryActivate(guards, args, instance, callback) {
    if (!guards || SharedUtils.isEmpty(guards)) {
      return true
    }

    const context = this.createContext(args, instance, callback)
    for (const guard of guards) {
      const result = guard.canActivate(context)
      if (await this.pickResult(result)) {
        continue
      }

      return false
    }
    
    return true
  }

  createContext(args, instance, callback) {
    return new ExecutionContextHost(args, instance.constructor, callback)
  }

  async pickResult(result) {
    if (result instanceof Rxjs.Observable) {
      return result.toPromise()
    }

    return result
  }
}

module.exports = GuardsConsumer
