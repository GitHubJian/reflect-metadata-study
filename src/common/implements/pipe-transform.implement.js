/**
 * 管道
 */
const ImplementException = require('../exceptions/implement.exception')

class PipeTransformImplement {
  constructor() {}
  /**
   *
   * @param {any} value 当前处理的参数
   * @param {Object} metadata 其元数据
   *        type: 'body' | 'query' | 'param' | 'custom';
   *        metatype?: new (...args) => any;
   *        data?: string;
   */
  transform(value, metadata) {
    throw new ImplementException(`PipeTransformImplement.transform`)
  }
}

module.exports = PipeTransformImplement
