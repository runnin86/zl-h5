// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import $ from 'zepto'
import App from './App'
import Vue from 'vue'
import axios from 'axios'
import store from './store/'
import WeVue from './components'
import router from './router'
import FastClick from 'fastclick'
import * as filters from './filters'
import * as config from './config'
import 'normalize.css/normalize.css'
import 'assets/iconfont/iconfont.css'
import infiniteScroll from './directives/infinite-scroll'
import setWechatTitle from './utils/setWechatTitle.js'
import util from './utils'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
    util.wxConfig()
  }, false)
}

Vue.config.debug = true
Vue.config.productionTip = false

Vue.use(WeVue)
Vue.prototype.$http = axios
Vue.prototype.initWechatShare = (title, desc, imgUrl, link) => {
  if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
    // TODO: Android手机需要重新配置jssdk
    util.wxConfig()
  }
  util.wxReady({
    title, desc, imgUrl, link
  }, (res) => {
    console.log('分享完成')
  }, (res) => {
    console.log('取消分享')
  }, (res) => {
    console.error(JSON.stringify(res))
  })
}

Vue.directive('infiniteScroll', infiniteScroll)

// axios全局配置
axios.defaults.baseURL = config.apiUrl
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// axios请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // let uid = 0
  // if (util.getStore('zlUser')) {
  //   uid = JSON.parse(util.getStore('zlUser')).user_id
  // }
  // let timestamp = Date.parse(new Date()) / 1000
  // let md5Str = md5(uid + '' + timestamp + 'NhH$ApI')
  // let param = {
  //   // XDEBUG_SESSION_START: 17258,
  //   uid: uid,
  //   timestamp: timestamp,
  //   sign: md5Str
  // }
  // if (!config.params) {
  //   config.params = {}
  // }
  // // 组装请求默认需要携带的参数
  // Object.assign(config.params, param)
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// axios响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  // console.log('response:' + response.config.url, '状态:' + response.status + '->' + response.statusText)
  return response
}, function (error) {
  $.toast('网络错误', 'forbidden')
  // Do something with response error
  return Promise.reject(error)
})

// 注册一个全局的 before 钩子
router.beforeEach((to, from, next) => {
  const toPath = to.path
  const fromPath = from.path
  const tLength = toPath.replace(/[^/]/g, '').length
  const fLength = fromPath.replace(/[^/]/g, '').length

  if (toPath !== '/oauth' && window.localStorage.getItem('zlUser') === null) {
    // 需要登录
    // console.log('需要登录', to, from)
    // let oauthUrl = '/oauth'
    // if (to.query.seller_id) {
    //   oauthUrl += '?seller_id=' + to.query.seller_id
    // }
    // window.location.href = oauthUrl
  }

  let pushUrl = ['/login', '/searchGoods']
  let bounceUrl = ['/goods', '/shopOrdDet', '/nhhDetail']
  // 页面切换效果
  if (tLength > fLength || bounceUrl.includes(toPath)) {
    router.options.transitionName = 'bounce'
  } else if (tLength < fLength || bounceUrl.includes(fromPath)) {
    router.options.transitionName = 'bounceOut'
  } else if (pushUrl.includes(toPath)) {
    router.options.transitionName = 'pushtop'
  } else if (pushUrl.includes(fromPath)) {
    router.options.transitionName = 'pushtopOut'
  } else {
    router.options.transitionName = 'fade'
  }

  // 是否隐藏底部菜单
  let showIndexUrl = ['/category', '/index', '/userCenter']
  let hideIndexUrl = [
    '/oauth',
    '/searchGoods',
    '/userCenter/accountManage',
    '/userCenter/addressList',
    '/shopOrdDet',
    '/nhhDetail'
  ]
  if (tLength > fLength || hideIndexUrl.includes(toPath)) {
    store.commit('CHANGE_IS_INDEX', false)
  } else if (tLength < fLength || showIndexUrl.includes(toPath)) {
    // 显示底部菜单时要去获取购物车数量
    store.dispatch('getCartNum')
    store.commit('CHANGE_IS_INDEX', true)
  }
  // 设置卖家ID
  // if (to.query.seller_id) {
  //   let u = JSON.parse(window.localStorage.getItem('zlUser'))
  //   if (u !== null) {
  //     if (u.is_shop === '0' && !util.getStore('seller_id_nhh')) {
  //       // 未开店的记录第一次获得的卖家ID
  //       util.setStore('seller_id_nhh', to.query.seller_id)
  //     } else if (u.is_shop === '1' && util.getStore('seller_id_nhh') !== to.query.seller_id) {
  //       // 已开店且存储的卖家ID和链接的卖家ID不一致时,记录链接的卖家ID
  //       util.setStore('seller_id_nhh', to.query.seller_id)
  //     }
  //   }
  // }
  // 确保要调用 next 方法，否则钩子就不会被 resolved。
  next()
})

// // 注册一个全局的 after 钩子
router.afterEach((route) => {
  // let title = route.meta.title ? route.meta.title : ''
  setWechatTitle('足力购')
  // 更新store中的route状态
  // store.commit([ROUTE_UPDATE_ROUTE], route)
})

// Filters
Vue.filter('orderStatusFilter', filters.orderStatusFilter)
Vue.filter('dateFilter', filters.dateFilter)
Vue.filter('split', filters.splitFilter)
Vue.filter('getArray', filters.getArray)

/* eslint-disable no-new */
new Vue({
  store, // inject store to all children
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
