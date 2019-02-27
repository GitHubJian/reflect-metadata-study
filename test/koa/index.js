const Koa = require('koa')
const KoaRouter = require('koa-router')

const app = new Koa()
const router = new KoaRouter()

router.get('/hello', async (ctx, next) => {
  ctx.body = 'hello, world'
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(8419, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})
