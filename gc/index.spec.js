require('babel-register')({
  plugins: ['transform-decorators-legacy']
})

require('reflect-metadata')
const C = require('../../index')
const { metadataKey } = require('../../constants')

let obj = new C()
let metadataValue = Reflect.getMetadata(metadataKey, obj, 'method')
console.log(metadataValue)
