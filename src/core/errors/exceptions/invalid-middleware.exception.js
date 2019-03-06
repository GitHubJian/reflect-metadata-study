'use strict'
const RuntimeException = require('./runtime.exception')
const Messages = require('../messages')

class InvalidMiddlewareException extends RuntimeException {
  constructor(name) {
    super(Messages.INVALID_MIDDLEWARE_MESSAGE`${name}`)
  }
}

module.exports = InvalidMiddlewareException
