module.exports = {
  UNHANDLED_RUNTIME_EXCEPTION: 'Unhandled Runtime Exception.',
  INVALID_MODULE_MESSAGE: (text, scope) => {
    return `Nest cannot create the module instance. Scope [${scope}]`
  }
}
