class RuntimeException extends Error {
  constructor(msg = '') {
    super(msg)
    this.mgs = msg
  }

  what() {
    return this.msg
  }
}

module.exports = RuntimeException
