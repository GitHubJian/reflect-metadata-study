require('reflect-matadata')

/**
 *
 * @param {*} decorators 装饰器数组
 * @param {*} target 装饰器目标
 * @param {*} key 元数据键
 * @param {*} desc 方法描述符
 */

function decorate(decorators, target, key, desc) {
  /* 获取参数长度，当参数长度小于3,说明目标就是target，否则目标为方法描述符，描述符不存在时，通过key从target获取，即认为key是方法名 */
  var c = arguments.length,
    r =
      c < 3
        ? target
        : desc === null
        ? (desc = Object.getOwnPropertyDescriptor(target, key))
        : desc,
    d

  /* 如果Reflect的decorate方法存在，则调用这个方法为目标调用装饰器方法数组，这个方法在reflect-matadata包中实现 */
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
    r = Reflect.decorate(decorators, target, key, desc)
  /* 如果Reflect.decorate方法不存在，则手动调用装饰方法，注意是倒序调用
    如果参数长度小于3说明是类装饰器，直接将类传递给装饰器方法
    如果参数长度等于3说明是类装饰器，但是key参数存在，与类一同传递给装饰器方法
    如果参数长度大于3说明是方法装饰器，将类、key、方法描述符传递给装饰器方法
    同时获取装饰器方法执行完毕的target给r，如果装饰器方法执行完毕没有返回值，则使用之前的r */ else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i]))
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
  /* 返回r，参数小于3时为类对象，参数大于3时为方法描述符
    当为描述符时需要重新将其定义到target上 */

  return c > 3 && r && Object.defineProperty(target, key, r), r
}
