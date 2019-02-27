require('reflect-metadata')
require('@babel/register')({
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
})

const DependenciesScanner = require('./scanner')
const AppModule = require('./appModule')

let ds = new DependenciesScanner()
ds.scan(AppModule)
