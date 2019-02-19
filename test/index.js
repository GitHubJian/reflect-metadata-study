require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const { Factory } = require('./../src/core/factory')
const AppModule = require('./app.module')

async function bootstrap() {
  let app = await Factory.create(AppModule)
}

bootstrap()
