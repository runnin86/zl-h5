const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const context = path.join(__dirname, '..')

module.exports = {
  entry: {
    vueFamily: [
      'vue',
      'vuex',
      'vue-router'
    ],
    extra: [
      'axios',
      'fastclick',
      'md5',
      'qs'
    ],
    business: [
      'weui.js',
      'src/components/city-picker/data.json'
    ]
  },
  output: {
    // 将打包后的 js 放到 static 目录下，build的时候会copy到dist目录
    path: path.join(context, 'static/dll'),
    filename: '[name].dll.js',
    library: '[name]'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'static': path.join(__dirname, '..', 'static'),
      'src': path.join(__dirname, '..', 'src')
    }
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(context, 'static/dll/[name].manifest.json'),
      name: '[name]',
      context: context
    }),
    // 压缩js代码
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: { // 删除打包后的注释
        comments: false
      }
    }),
    // 删除上次生成的相关文件
    new CleanWebpackPlugin([
      '*.js', '*.manifest.json'
    ], {
      root: path.join(context, 'static/dll'),
      verbose: true,
      dry: false
    })
  ]
}
