const KoaAdapter = require('./koa-adapter')
const KoaRouter = require('koa-router')

class KoaFactory {
  static create() {
    return new KoaAdapter(new KoaRouter())
  }
}

module.exports = KoaFactory
