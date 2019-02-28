const CanActivate = require('../../src/common/implements/can-activate.implement')

class AuthGuard extends CanActivate {
  canActivate(context) {
    return true
  }
}

module.exports = AuthGuard
