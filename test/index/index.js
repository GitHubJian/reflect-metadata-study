require('reflect-metadata')
require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const AppModule = require('./appModule')
const { Factory } = require('../../src/core/factory')

async function bootstrap() {
  let app = await Factory.create(AppModule)
  
  await app.listen(8417, () => {
    console.log('✨ 服务已启动: http://localhost:8417')
  })
}

bootstrap()
