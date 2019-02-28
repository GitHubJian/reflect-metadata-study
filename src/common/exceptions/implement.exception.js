class ImplementException extends Error {
  constructor(funcname, status) {
    super()
    this.response = `This method(${funcname}) must be overloaded`
    this.message = `This method(${funcname}) must be overloaded`
    this.status = status
  }

  getResponse() {
    return this.response
  }

  getStatus() {
    return this.status
  }
}

module.exports = ImplementException
