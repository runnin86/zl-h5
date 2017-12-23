/**
 * 配置css加载器以及编译css之后自动添加前缀
 */

var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  // css加载器
  loaders: utils.cssLoaders({
    sourceMap: isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap,
    extract: isProduction
  }),
  // 让 vue-loader 知道需要对 audio 的 src 属性的内容转换为模块
  transformToRequire: {
    // video: 'src',
    // source: 'src',
    // img: 'src',
    // image: 'xlink:href'
  }
}
