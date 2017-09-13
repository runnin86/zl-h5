import Vue from 'vue'
import Router from 'vue-router'
import Demo from '@/views/demo/demo'

Vue.use(Router)

export default new Router({
  // base: '/app',
  mode: 'hash', // hash,history,abstract
  transitionName: 'fade', // 页面切换动画名称
  routes: [
    {
      path: '/',
      redirect: '/category'
    }, {
      path: '/oauth',
      component(resolve) {
        require(['@/views/oauth'], resolve)
      }
    }, {
      path: '/userCenter',
      meta: {scrollToTop: true, title: '用户中心', requiresAuth: true},
      component(resolve) {
        require(['@/views/user/userCenter'], resolve)
      }
    }, {
      path: '/userCenter/active',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/active'], resolve)
      }
    }, {
      path: '/userCenter/addressList',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/addressList'], resolve)
      }
    }, {
      path: '/userCenter/shareQRCode',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/shareQRCode'], resolve)
      }
    }, {
      path: '/nhhDetail',
      meta: {scrollToTop: true, title: '成为汇商'},
      component(resolve) {
        require(['@/views/user/nhhDetail'], resolve)
      }
    }, {
      path: '/userCenter/changePwd',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/changePwd'], resolve)
      }
    }, {
      path: '/userCenter/addressList/newAddress',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/newAddress'], resolve)
      }
    }, {
      path: '/userCenter/myCollect',
      component(resolve) {
        require(['@/views/user/myCollect'], resolve)
      }
    }, {
      name: 'OrderList',
      path: '/userCenter/orderList',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/orderList'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex',
      component(resolve) {
        require(['@/views/commission/withdrawIndex'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex/settledRecord',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/commission/settledRecord'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex/record',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/commission/withdrawRecord'], resolve)
      }
    }, {
      path: '/userCenter/personnelsManage',
      component(resolve) {
        require(['@/views/user/personnelsManage'], resolve)
      }
    }, {
      path: '/userCenter/goodsShare',
      component(resolve) {
        require(['@/views/user/goodsShare'], resolve)
      }
    }, {
      path: '/userCenter/orderManage',
      component(resolve) {
        require(['@/views/user/orderManage'], resolve)
      }
    }, {
      path: '/userCenter/sellerIncome',
      component(resolve) {
        require(['@/views/user/sellerIncome'], resolve)
      }
    }, {
      path: '/userCenter/accountManage',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/user/accountManage'], resolve)
      }
    }, {
      path: '/userCenter/accountManage/sellerFundUse',
      component(resolve) {
        require(['@/views/user/sellerFundUse'], resolve)
      }
    }, {
      path: '/userCenter/setStore',
      component(resolve) {
        require(['@/views/user/setStore'], resolve)
      }
    }, {
      path: '/index',
      name: 'Index',
      component(resolve) {
        require(['@/views/shopping/index'], resolve)
      }
    }, {
      path: '/category',
      name: 'Category',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/shopping/category'], resolve)
      }
    }, {
      path: '/categoryClassify',
      name: 'CategoryClassify',
      component(resolve) {
        require(['@/views/shopping/categoryClassify'], resolve)
      }
    }, {
      path: '/shopping/goods',
      meta: {requiresAuth: true, scrollToTop: true},
      name: 'Goods',
      component(resolve) {
        require(['@/views/shopping/goods'], resolve)
      }
    }, {
      path: '/commentList',
      name: 'CommentList',
      component(resolve) {
        require(['@/views/shopping/commentList'], resolve)
      }
    }, {
      path: '/commentGoods',
      name: 'CommentGoods',
      component(resolve) {
        require(['@/views/shopping/commentGoods'], resolve)
      }
    }, {
      path: '/searchGoods',
      component(resolve) {
        require(['@/views/shopping/searchGoods'], resolve)
      }
    }, {
      path: '/showSearch',
      component(resolve) {
        require(['@/views/shopping/showSearch'], resolve)
      }
    }, {
      path: '/index/panicBuy',
      name: 'PanicBuy',
      component(resolve) {
        require(['@/views/panicBuy/panicBuy'], resolve)
      }
    }, {
      path: '/cart',
      meta: {scrollToTop: true, title: '购物车', requiresAuth: true},
      component(resolve) {
        require(['@/views/cart/cart'], resolve)
      }
    }, {
      path: '/login',
      component(resolve) {
        require(['@/views/user/login'], resolve)
      }
    }, {
      path: '/orderfill',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/shopping/orderFill'], resolve)
      }
    }, {
      path: '/orderSubmit',
      component(resolve) {
        require(['@/views/shopping/orderSubmit'], resolve)
      }
    }, {
      path: '/shopOrdDet',
      name: 'ShopOrdDet',
      component(resolve) {
        require(['@/views/user/shopOrdDet'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex/withdraw',
      meta: {requiresAuth: true},
      component(resolve) {
        require(['@/views/commission/withdraw'], resolve)
      }
    }, {
      path: '/cashRecord',
      component(resolve) {
        require(['@/views/commission/cashRecord'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex/weChatBind',
      component(resolve) {
        require(['@/views/commission/weChatBind'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex/alipayBind',
      component(resolve) {
        require(['@/views/commission/alipayBind'], resolve)
      }
    }, {
      path: '/userCenter/withdrawIndex/bankBind',
      component(resolve) {
        require(['@/views/commission/bankBind'], resolve)
      }
    }, {
      path: '/demo',
      component: Demo
    }, {
      path: '*',
      component(resolve) {
        require(['@/views/404'], resolve)
      }
    }
  ]
})
