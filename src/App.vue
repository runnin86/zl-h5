<template>
  <div class="page__bd" style="height: 100%;overflow:hidden;">
    <transition :name="$router.options.transitionName" mode="out-in">
      <keep-alive>
        <router-view class="container container-content weui-tab__panel viewScroll"></router-view>
      </keep-alive>
    </transition>

    <wv-tabbar v-if="showIndex" style="position: fixed;table-layout: fixed;border-top: 1px solid #ddd;">
      <wv-tabbar-item to="/index" :is-on="$route.path==='/index' || $route.path==='/category'">
        <span slot="icon" style="display: inline-block; position: relative; height:34px">
          <!-- <img class="weui-tabbar__icon" src="static/weui/images/icon_nav_search_bar.png" slot="icon"> -->
          <i class="iconfont-yzg icon-yzg-goods" style="font-size:26px"></i>
        </span>
        购物
      </wv-tabbar-item>

      <wv-tabbar-item to="/cart" :is-on="$route.path==='/cart'">
        <span slot="icon" style="display: inline-block; position: relative; height:34px">
          <!-- <img class="weui-tabbar__icon" :src="thumbSmall" slot="icon"> -->
          <i class="iconfont-yzg icon-yzg-msnui-cart" style="font-size:26px"></i>
          <wv-badge v-show="cartBadgeNum"
            style="position: absolute;top: -2px;right: -16px;padding:.15em .53em;">{{cartBadgeNum}}</wv-badge>
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
        <span slot="icon" style="display: inline-block; position: relative; height:34px">
          <!-- <img class="weui-tabbar__icon" :src="thumbSmall" slot="icon"> -->
          <i class="iconfont-yzg icon-yzg-wode" style="font-size:26px"></i>
          <wv-badge is-dot style="position: absolute;top: 0;right: -6px;">8</wv-badge>
        </span>
         我的
      </wv-tabbar-item>
    </wv-tabbar>

  </div>
</template>

<script>
import $ from 'zepto'
// import wx from 'weixin-js-sdk'
import {mapGetters} from 'vuex'
import thumbSmall from 'static/weui/images/icon_tabbar.png'
// import * as config from './config'

export default {
  // name: 'app',
  mounted () {
    // // 去后台获取签名等信息
    // this.$http.get('http://127.0.0.1:8090/api/v1/weChat/wxConfig')
    // .then(({data: {data, code, msg}}) => {
    //   // 微信配置
    //   wx.config({
    //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
    //     appId: config.appId, // 必填，公众号的唯一标识
    //     timestamp: data.timestamp, // 必填，生成签名的时间戳
    //     nonceStr: data.nonceStr, // 必填，生成签名的随机串
    //     signature: data.signature, // 必填，签名，见附录1
    //     jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    //       'onMenuShareTimeline',
    //       'onMenuShareAppMessage',
    //       'onMenuShareQQ',
    //       'onMenuShareWeibo',
    //       'onMenuShareQZone',
    //       'chooseImage',
    //       'uploadImage',
    //       'startRecord',
    //       'stopRecord',
    //       'onVoiceRecordEnd',
    //       'uploadVoice'
    //     ]
    //   })
    // }, (response) => {
    //   // error callback
    //   console.error(response)
    // })
  },
  computed: {
    ...mapGetters({
      // 键为在当前页面展示,值为modules中getters中定义的键
      products: 'cartProducts',
      checkoutStatus: 'checkoutStatus',
      cartBadgeNum: 'cartBadge',
      showIndex: 'isIndex',
      userInfo: 'userInfo'
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
      fromPath: null,
      scrollTop: 0
    }
  },
  methods: {
    gotoAddress (path) {
      this.$router.push(path)
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
    }
  },
  // dynamically set transition based on route change
  watch: {
    '$route' (to, from) {
      this.toPath = to.path
      this.fromPath = from.path
      // 进入详情页时需要记录滚动条距离头部距离
      if (from.path === '/category') {
        this.scrollTop = $('.container').scrollTop()
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
/*@import '/static/style/bootstrap.min.css';*/
@import '/static/style/store.css';
@import '/static/style/public.css';
/*@import '/static/style/progressive.css';*/

[v-cloak] {
  display: none;
}

.viewScroll {
  position: absolute;
  overflow: auto;
}

html,
body {
  background-color: #f8f8f8;
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
.yzg-title{
  height:44px;
  line-height:44px;
  background:#d6244f;
  color:#fff;
  font-size:18px;
  position: fixed;
  width:100%;
  max-width:640px;
  min-width:320px;
  z-index:100;
}
.yzg-title .shop-name{
  text-align: center;
}
.weui-badge_dot {
  padding: .4em;
  min-width: 0 ;
}
/*.weui-tabbar__item.weui-bar__item_on > span > i {
  color: #09bb07;
}*/
</style>
