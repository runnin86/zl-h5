<template>
  <div class="page__bd">
    <transition :name="$router.options.transitionName" mode="out-in">
      <keep-alive>
        <router-view class="container container-content viewStyle"></router-view>
      </keep-alive>
    </transition>

    <wv-tabbar v-if="showIndex" style="position: fixed;table-layout: fixed;box-shadow:0 -5px 30px rgba(0,0,0,0.1);">
      <wv-tabbar-item to="/category" :is-on="$route.path==='/category'">
        <span slot="icon" class="botMenu">
          <img v-if="$route.path==='/category'" src="/static/images/sale_c.png"/>
          <img v-else src="/static/images/sale.png"/>
        </span>
        购物
      </wv-tabbar-item>

      <wv-tabbar-item to="/cart" :is-on="$route.path==='/cart'">
        <span slot="icon" class="botMenu">
          <img v-if = "$route.path==='/cart'" src="/static/images/shop_c.png"/>
          <img v-else src="/static/images/shop.png"/>
          <wv-badge v-show="cartBadgeNum"
            style="position: absolute;top: 0;right: -10px;padding:.10em .43em;">{{cartBadgeNum}}</wv-badge>
        </span>
         购物车
      </wv-tabbar-item>

      <!-- <wv-tabbar-item to="/panicBuy" :is-on="$route.path==='/panicBuy'">
        <span slot="icon" style="display: inline-block; position: relative; height:34px">
          <img class="weui-tabbar__icon" :src="thumbSmall" slot="icon">
          <i class="iconfont-yzg icon-yzg-naozhong" style="font-size:26px"></i>
        </span>
         限时抢购
      </wv-tabbar-item> -->

      <wv-tabbar-item to="/userCenter" :is-on="$route.path==='/userCenter'">
        <span slot="icon" class="botMenu">
          <img v-if = "$route.path==='/userCenter'" src="/static/images/user_c.png"/>
          <img v-else src="/static/images/user.png"/>
          <!-- <wv-badge is-dot style="position: absolute;top: 0;right: -6px;">8</wv-badge> -->
        </span>
         我的
      </wv-tabbar-item>
    </wv-tabbar>

  </div>
</template>

<script>
// import $ from 'zepto'
import {mapGetters} from 'vuex'
import thumbSmall from 'static/weui/images/icon_tabbar.png'

export default {
  // name: 'app',
  mounted () {
  },
  computed: {
    ...mapGetters({
      // 键为在当前页面展示,值为modules中getters中定义的键
      products: 'cartProducts',
      checkoutStatus: 'checkoutStatus',
      cartBadgeNum: 'cartBadge',
      showIndex: 'isIndex'
    }),
    total () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  },
  data () {
    return {
      thumbSmall,
      toPath: null,
      fromPath: null
    }
  },
  methods: {
    /**
     * 判断微信浏览器
     */
    is_weixn() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') !== -1) {
        return true
      } else {
        return false
      }
    },
    gotoAddress (path, query) {
      this.$router.push({path: path, query: query})
    },
    back () {
      this.$router.back()
      // window.history.back()
      // window.history.go(-1)
    },
    randomString (len) {
      // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
      let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      let maxPos = $chars.length
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    getShareImg () {
      // 分享图片地址
      let imgUrl = window.location.origin + '/static/images/logo-new1.jpeg'
      if (window.localStorage.getItem('zlUser') !== null) {
        // 默认展示用户头像
        imgUrl = JSON.parse(window.localStorage.getItem('zlUser')).headImgUrl
      }
      return imgUrl
    }
  },
  // dynamically set transition based on route change
  watch: {
    '$route' (to, from) {
      this.toPath = to.path
      this.fromPath = from.path
      // 页面需要滚动到顶部
      if (to.matched.some(m => m.meta.scrollToTop)) {
        setTimeout(_ => {
          document.body.scrollTop = 0
        }, 300)
      }
      // 默认全局分享
      let ignoreUrl = [
        '/index',
        '/index/sevenPanicBuy',
        '/shopping/goods',
        '/userCenter/shareQRCode',
        '/oauth',
        '/favicon.ico'
      ]
      if (!ignoreUrl.includes(to.path)) {
        let base = this.$router.options.base ? this.$router.options.base : ''
        // 分享图片地址
        let imgUrl = this.getShareImg()
        // 默认全局分享
        let desc = '【足力购】帅哥美女们，快来足力购逛逛，捧个场吧！'
        let link = window.location.origin + base + '/?#/category'
        this.initWechatShare(
          '足力购商城欢迎您',
          desc,
          imgUrl,
          link
        )
      }
    }
  }
}
</script>

<style>
/*[
  slide-fade:慢速平滑切入
  fade:平滑切入
  bounce:从右至左切入
  pushtop:从下至上切入
]*/
@import '/static/style/transition.css';
@import '/static/style/store.css';
@import '/static/style/public.css';
/*@import '/static/style/progressive.css';*/

[v-cloak] {
  display: none;
}

[v-cloak] {
  display: none;
}

.tab-panel {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 50px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.viewScroll {
  position: absolute;
  overflow: auto;
}
.loading {
  margin-left:-20px;
}
.loading .weui-loading {
  width: 40px;
  height: 40px;
}

html,
body {
  background-color: #eee;
  user-select: none;
}

a,
img {
  -webkit-touch-callout: none;
}

.page__hd {
  padding: 40px;

  .page__title {
    text-align: left;
    font-size: 20px;
    font-weight: 400;
  }

  .page__desc {
    margin-top: 5px;
    color: #888;
    text-align: left;
    font-size: 14px;
  }
}

.page-with-padding {
  padding: 0 .7rem;
}

.page {
  margin-bottom: 50px;
}
.container-content {
  max-width:640px;
  min-width:320px;
  right:0;
  left:0;
  margin:auto;
}

.viewStyle{ box-sizing:border-box; padding-bottom:50px;}

.weui-badge_dot {
  padding: .4em;
  min-width: 0 ;
}
/*.weui-tabbar__item.weui-bar__item_on > span > i {
  color: #09bb07;
}*/
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon>i, .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{ color:#666; }
.weui-tabbar__item img{ width:26px; }
.botMenu{display: inline-block; position: relative; height:30px; padding-top:5px}
</style>
