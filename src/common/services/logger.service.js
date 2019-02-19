const EnvironmentEnum = require('../enums/environment.enum')
const SharedUtils = require('../utils/shared.utils')
const clc = require('cli-color')

var LoggerStatic, Logger

Logger = LoggerStatic = class Logger {
  constructor(context, isTimeDiffEnabled = false) {
    this.context = context
    this.isTimeDiffEnabled = isTimeDiffEnabled
  }

  log(message, context) {
    const { logger } = LoggerStatic // ???
    if (logger === this) {
      LoggerStatic.log(message, context || this.context, this.isTimeDiffEnabled)
      return
    }

    logger && logger.log.call(logger, message, context || this.context)
  }

  error(message, trace = '', context) {
    const { logger } = LoggerStatic // ???
    if (logger === this) {
      LoggerStatic.error(message, trace, context || this.context)
      return
    }

    logger && logger.error.call(logger, message, trace, context || this.context)
  }

  warn(message, context) {
    const { logger } = LoggerStatic
    if (logger === this) {
      LoggerStatic.warn(
        message,
        context || this.context,
        this.isTimeDiffEnabled
      )
      return
    }

    logger && logger.warn.call(logger, message, context || this.context)
  }

  static overrideLogger(logger) {
    this.logger = logger ? logger : undefined
  }

  static setMode(mode) {
    this.contextEnvironment = mode
  }

  static log(message, context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, clc.green, context, isTimeDiffEnabled)
  }

  static error(message, trace = '', context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, clc.red, context, isTimeDiffEnabled)
    this.printStackTrace(trace)
  }

  static warn(message, context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, clc.yellow, context, isTimeDiffEnabled)
  }

  static isActive() {
    return LoggerStatic.contextEnvironment !== EnvironmentEnum.TEST
  }

  static printMessage(message, color, content = '', isTimeDiffEnabled) {
    if (!this.isActive()) {
      return
    }

    const output = SharedUtils.isObject(message)
      ? JSON.stringify(message, null, 2)
      : message
    process.stdout.write(color(`[Nest] ${process.pid}   - `))
    process.stdout.write(`${new Date(Date.now()).toLocaleString()}   `)
    context && process.stdout.write(this.yellow(`[${context}] `))
    process.stdout.write(color(output))
    this.printTimestamp(isTimeDiffEnabled)
    process.stdout.write(`\n`)
  }

  static printTimestamp(isTimeDiffEnabled) {
    const includeTimestamp = LoggerStatic.prevTimestamp && isTimeDiffEnabled
    if (includeTimestamp) {
      process.stdout.write(
        this.yellow(` +${Date.now() - Logger_1.prevTimestamp}ms`)
      )
    }

    LoggerStatic.prevTimestamp = Date.now()
  }

  static printStackTrace(trace) {
    if (!this.isActive() || !trace) {
      return
    }

    process.stdout.write(trace)
    process.stdout.write(`\n`)
  }
}

Logger.logger = LoggerStatic
Logger.contextEnvironment = EnvironmentEnum.RUN
Logger.yellow = clc.xterm(3)

module.exports = Logger
