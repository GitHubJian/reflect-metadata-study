const CanActivate = require('../../src/common/implements/can-activate.implement')

class AuthGuard extends CanActivate {
  canActivate(context) {
    let flag = context.args.params['0'] !== 1

    return flag
  }
}

module.exports = AuthGuard
