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
import 'normalize.css/normalize.css'
import 'assets/iconfont/iconfont.css'
import infiniteScroll from './directives/infinite-scroll'
import setWechatTitle from './utils/setWechatTitle.js'
import util from './utils'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

Vue.config.debug = true
Vue.config.productionTip = false

Vue.use(WeVue)
Vue.prototype.$weChatShareDesc = () => {
  let desc = '【足力购】帅哥美女们，快来足力购逛逛，捧个场吧！'
  return desc
}
Vue.prototype.$http = axios
Vue.prototype.initWechatShare = (title, desc, imgUrl, link) => {
  util.wxShareReady({
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
axios.defaults.baseURL = process.env.BASE_API
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
  if (response.data.msg === '用户未登录或登录已失效') {
    $.toast('会话失效<br/>即将重新登录', 'forbidden')
    // 清空再次鉴权
    util.reOauth()
  }
  return response
}, function (error) {
  // $.toast('网络错误', 'forbidden')
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
    '/oauth',
    '/searchGoods',
    '/userCenter/accountManage',
    '/userCenter/addressList',
    '/userCenter/withdrawIndex',
    '/userCenter/withdrawIndex/withdraw',
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
  // 登录校验
  // let base = router.options.base ? router.options.base : ''
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (util.getStore('zlUser') === null) {
      store.commit('CHANGE_IS_INDEX', false)
      // 需要登录,并且记录hash参数
      if (!util.getStore('url_hash_zl')) {
        if (location.pathname !== '/') {
          // 适配旧的分享链接
          util.setStore('url_hash_zl', '#' + location.pathname + location.search)
        } else {
          util.setStore('url_hash_zl', location.hash === '#/' ? '' : location.hash)
        }
      }
      if (util.is_weixin()) {
        next({path: '/oauth'})
      } else {
        alert('请在微信中打开')
      }
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

// // 注册一个全局的 after 钩子
router.afterEach((route) => {
  let title = route.meta.title ? route.meta.title : ''
  setWechatTitle(title)
  // 1.自动添加问号(?);2.自动把分隔符由#!变成#;3.分隔符后面，自动判断是否为斜杠(/)，没有则添加上
  let paths = window.location.href.split('#')
  paths[1] = paths[1] || '/'
  // 老式的#!分隔跳转
  if (paths[0].charAt(paths[0].length - 1) !== '?') {
    paths[0] = `${paths[0]}?`
  }
  if (paths[1].charAt(0) === '!') {
    paths[1] = paths[1].substr(1)
  }
  let url = `${paths[0]}#${paths[1]}`
  if (window.location.href !== url) {
    window.location.href = url
  }
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
