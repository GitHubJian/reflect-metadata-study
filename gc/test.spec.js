require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const { TestService, Factory } = require('./test')

Factory(TestService).testMethod()
