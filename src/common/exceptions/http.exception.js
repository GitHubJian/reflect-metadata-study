class HttpException extends Error {
  constructor(response, status) {
    super()
    this.response = response
    this.status = status
    this.message = response
  }

  getResponse() {
    return this.response
  }

  getStatus() {
    return this.status
  }
}

module.exports = HttpException
