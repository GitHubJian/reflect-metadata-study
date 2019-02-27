class HttpException extends Error {
  constructor(ctx, status) {
    super()
    this.response = ctx.res
    this.status = status
    this.message = ctx.res
  }

  getResponse() {
    return this.response
  }

  getStatus() {
    return this.status
  }
}

module.exports = HttpException
