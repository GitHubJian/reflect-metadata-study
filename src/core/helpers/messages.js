const RequestMethod = require('../../common/enums/request-method.enum')

module.exports = {
  MODULE_INIT_MESSAGE: (text, module) => {
    return `${module} dependencies initialized`
  },
  ROUTE_MAPPED_MESSAGE: (path, method) => {
    return `Mapped {${path}, ${RequestMethod[method]}} route`
  },
  CONTROLLER_MAPPING_MESSAGE: (name, path) => {
    return `${name} {${path}}:`
  }
}
