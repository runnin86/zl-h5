/**
  1 配置webpack编译入口
  2 配置webpack输出路径和命名规则
  3 配置模块resolve规则
  4 配置不同类型模块的处理规则
 */

const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const vueLoaderConfig = require('./vue-loader.conf')

// 给出正确的绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 配置webpack编译入口
  entry: {
    app: './src/main.js'
  },
  // 配置webpack输出路径和命名规则
  output: {
    // webpack输出的目标文件夹路径（例如：/dist）
    path: config.build.assetsRoot,
    // webpack输出bundle文件命名格式
    filename: '[name].js',
    // webpack编译输出的发布路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  externals: {
    'zepto': 'Zepto',
    'BMap': 'BMap',
    'wx': 'jWeixin'
  },
  // 提示文件体积大于150kb
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxAssetSize: 150000
  },
  // 配置模块resolve的规则
  resolve: {
    // 自动resolve的扩展名
    extensions: ['.js', '.vue', '.json'],
    // resolve模块的时候要搜索的文件夹
    modules: [
      resolve('src'), resolve('node_modules')
    ],
    /*
     * 创建路径别名，有了别名之后引用模块更方便，
     * 例如import Vue from 'vue/dist/vue.esm.js'可以写成 import Vue from 'vue'
     */
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'static': resolve('static'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components')
    }
  },
  // 配置不同类型模块的处理规则
  module: {
    rules: [
      {
        // 对src和test文件夹下的.js和.vue文件使用eslint-loader
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        // 对所有.vue文件使用vue-loader
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        // 对src和test文件夹下的.js文件使用babel-loader
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: function(path) {
          // 路径中含有 node_modules 的就不去解析。
          var isNpmModule = !!path.match(/node_modules/)
          return isNpmModule
        },
        include: [resolve('src'), resolve('test')]
      },
      {
        // 对图片资源文件使用url-loader，query.name指明了输出的命名规则
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        // 对字体资源文件使用url-loader，query.name指明了输出的命名规则
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      // name参数和dllplugin里面name一致，可以不传
      name: 'vueFamily',
      // dllplugin 打包输出的manifest.json
      manifest: require('../static/dll/vueFamily.manifest.json'),
      // 和dllplugin里面的context一致
      context: path.join(__dirname, '..')
    }),
    new webpack.DllReferencePlugin({
      name: 'extra',
      // dllplugin 打包输出的manifest.json
      manifest: require('../static/dll/extra.manifest.json'),
      // 和dllplugin里面的context一致
      context: path.join(__dirname, '..')
    }),
    new webpack.DllReferencePlugin({
      name: 'business',
      // dllplugin 打包输出的manifest.json
      manifest: require('../static/dll/business.manifest.json'),
      // 和dllplugin里面的context一致
      context: path.join(__dirname, '..')
    })
  ]
}
