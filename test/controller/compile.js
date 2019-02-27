const Constants = require('../../src/common/constants')
let ctx = { method: 0, path: 'app' }

function ControllerCompile(target) {
  let path = Reflect.getMetadata(Constants.PATH_METADATA, target)
  let controller = new target()
  
  for (const p in target) {
    console.log(p)
    // if (controller.hasOwnProperty(p)) {
    //   if (typeof p === 'function') {
    //     console.log(p)
    //   }
    // }
  }
  let methodMetadata = Reflect.getMetadata(
    Constants.METHOD_METADATA,
    controller.findStudent
  )

  let pathMetadata = Reflect.getMetadata(
    Constants.PATH_METADATA,
    controller.findStudent
  )
}

module.exports = ControllerCompile
