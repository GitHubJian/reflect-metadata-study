class RuntimeException extends Error {
  constructor(msg = ``) {
    super(msg)
    this.msg = msg
  }
  what() {
    return this.msg
  }
}

module.exports = RuntimeException
