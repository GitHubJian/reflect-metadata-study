class ExecutionContextHost {
  /**
   *
   * @param {Koa} args koa ctx
   * @param {*} constructorRef
   * @param {*} handler
   */
  constructor(args, constructorRef = null, handler = null) {
    this.args = args
    this.constructorRef = constructorRef
    this.handler = handler
  }

  getClass() {
    return this.constructorRef
  }

  getHandler() {
    return this.handler
  }

  getArgs() {
    return this.args
  }

  getArgByIndex(index) {
    if (index === 0) {
      return this.args.req
    } else if (index === 1) {
      return this.args.res
    } else {
      return null
    }
  }
}

module.exports = ExecutionContextHost
