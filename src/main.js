// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
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
// import util from './utils'
// import md5 from 'md5'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

Vue.config.debug = true
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(WeVue)

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
  // Do something with response error
  return Promise.reject(error)
})

// 注册一个全局的 before 钩子
router.beforeEach((to, from, next) => {
  const toPath = to.path
  const fromPath = from.path
  const tLength = toPath.replace(/[^/]/g, '').length
  const fLength = fromPath.replace(/[^/]/g, '').length

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
    '/welcome',
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
  // 确保要调用 next 方法，否则钩子就不会被 resolved。
  next()
})

// // 注册一个全局的 after 钩子
router.afterEach((route) => {
  // 更新store中的route状态
  // store.commit([ROUTE_UPDATE_ROUTE], route)
})

// Filters
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
