/**
  1 loading动画
  2 删除创建目标文件夹
  3 webpack编译
  4 输出信息
 */

// 检查NodeJS和npm的版本
require('./check-versions')()

process.env.NODE_ENV = 'production'
process.noDeprecation = true

// ora插件，实现node.js 命令行环境的 loading效果， 和显示各种状态的图标等

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')

// 用于在控制台输出带颜色字体的插件
var chalk = require('chalk')

var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora({color: 'green', text: 'building for production...'})
spinner.start()

// rimraf插件，每次启动编译或者打包之前，先把整个dist文件夹删除，然后再重新生成dist
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
