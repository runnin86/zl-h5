<template>
<div>
  <div onclick="xiaoshi()" id="is_first_div1" class="is_first_div_add">
    <!--img src="/images/share_wx.png" class="share_wx_add"/-->
  </div>
  <!--头部标题-->
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name" v-if="main">
      <span>{{main.productName}}</span>
      <!-- <span class="double_title buyer_comment">商品详情</span>
      <router-link :to="{name: 'CommentList', path: '/commentList', query: {gid: pid}}" class="double_title">买家评论</router-link> -->
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{name: 'Category',path: '/category'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <!--轮播图及内容-->
  <div class="goodsMain">
    <div style="position:relative">
      <div class="detail-img">
        <wv-swipe class="demo-swipe" :height="300" :auto="4000">
          <wv-swipe-item class="demo-swipe-item" v-for="img in photo" :key="img.id">
            <img :src="imgBase64" :style="{backgroundImage: 'url(' + img_domain + img.resource + ')'}">
          </wv-swipe-item>
        </wv-swipe>
      </div>
    </div>
    <div class="row" style="margin:0px; margin-top:10px">
      <div class="col-xs-12 goodsTitle" v-if="main">
        <p>
          {{main.productName}}
        </p>
        <div class="shop_price">
          ￥{{main.price}}
          <span class="shop_price_span_add">
            市场价￥{{main.marketPrice}}
          </span>
          <div class="goodNum">
            <a class="add" @click="numberChange('del')">-</a>
            <input type="text" v-model="buyNum" />
            <a class="delete" style="cursor:pointer" @click="numberChange('add')">+</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row info_goods">
    <div class="col-xs-4" style="text-align:left">
      <img src="/static/images/zheng.png">&nbsp;正品保证
    </div>
    <div class="col-xs-4" style="text-align:center;">
      <img src="/static/images/qu.png">&nbsp;全球直采
    </div>
    <div class="col-xs-4" style="text-align:right;">
      <img src="/static/images/bao.png">&nbsp;同城配送
    </div>
  </div>
  <div class="goodsTxt">
    <p class="redColor">#商品详情#</p>
  </div>
  <div class="goodsBrief" v-if="main" v-html="main.profile"></div>
  <span class="red-dot"></span>
  <div class="cartBottom">
    <div class="cartImg clearfix">
      <!-- 购物车图标 -->
      <router-link :to="'/cart'">
        <a class="cart_png addCartPng">
          <span class="iconfont-yzg icon-yzg-msnui-cart"></span>
          <span class="quantity redBgColor" v-show="$store.getters.cartBadge>0">
            {{$store.getters.cartBadge}}
          </span>
        </a>
      </router-link>
      <!-- 收藏图标 -->
      <a @click="collect(pid)" class="cart_png">
        <span v-if="main" :class="['iconfont-yzg', main.isSale === '上架' ? 'icon-yzg-shoucang' : 'icon-yzg-shouc_no']"></span>
      </a>
    </div>
    <div class="clearfix" style=" padding-left:40%;">
      <div class="tbl-cell">
        <a class="btn-cart redBgColor" @click="addCartFn(pid)">
          <span class="iconfont-yzg icon-yzg-msnui-cart"></span>加入购物车
        </a>
      </div>
    </div>
  </div>
  <!--底部导航结束-->
  <div class="loading" v-if="load">
    <i class="weui-loading"></i>
  </div>
</div>
</template>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'

export default {
  init() {
    // console.log('初始化')
  },
  created() {
  },
  beforeDestroy() {
  },
  activated() {
    this.main = this.photo = null
    this.buyNum = 1
    this.pid = this.$route.query.gid
    this.loadGood()
    this.$store.commit('CHANGE_IS_INDEX', false)
    $('.red-dot').css({
      'left': this.startX + 'px',
      'bottom': this.moveY + 'px'
    })
  },
  data() {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      pid: null,
      main: null,
      photo: null,
      img_domain: 'http://img.zulibuy.com/images/',
      buyNum: 1, // 购买数量
      startX: '',
      clientX: '',
      centerX: '',
      stopX: '',
      moveY: 20,
      vx: '',
      vy: 4,
      timer: 20,
      delTimer: null,
      addTimer: null,
      load: true // 是否显示加载动画
    }
  },
  methods: {
    loadGood() {
      this.$http.post('product/productDetail', qs.stringify({
        pid: this.pid
      })).then(({data: {data, code, msg}}) => {
        if (code === 1) {
          // console.log(data)
          this.main = data.main
          this.photo = data.photo
          // 微信分享初始化->(title, desc, imgUrl, link)
          let desc = '分享内容描述写在这里'
          this.$parent.initWechatShare(
            '分享标题123',
            desc,
            this.img_domain + data.photo[0],
            window.location.href)
        } else {
          $.toast(msg, 'forbidden')
          console.error('获取商品失败:' + msg)
        }
        this.load = false
      }, (response) => {
        // error callback
        console.error(response)
      })
    },
    numberChange(opaeratType) { // 购买商品数量
      if (opaeratType === 'add') {
        if (this.main.numbers > 1) {
          this.buyNum = this.buyNum - (-1)
          this.main.numbers -= 1
        } else {
          weui.alert('库存不足，请选择其他商品')
        }
      } else {
        if (this.buyNum > 1) {
          this.buyNum -= 1
        } else {
          weui.alert('购买最小数量为1')
        }
      }
    },
    addCartFn(pid) {
      let token = window.localStorage.getItem('zlToken')
      if (token) {
        this.$http.get('cart/addToCart', {
          params: {
            pid: pid,
            num: this.buyNum
          },
          headers: {
            'x-token': token
          }
        }).then(({data: {code, data, msg}}) => {
          if (code === 1) {
            this.moveCart()
            // 获取购物车数量
            this.$store.dispatch('getCartData')
          } else {
            $.toast(msg, 'forbidden')
          }
        }).catch((e) => {
          console.error('商品选中状态更改失败:' + e)
        })
      } else {
        $.toast('您还没有登录', 'forbidden')
      }
    },
    collect() {
      $.toast('敬请期待')
    },
    /*
     * 加入购物车动画效果
     */
    moveCart() {
      this.startX = ($('.btn-cart').width() / 2) + $('.btn-cart').offset().left
      this.clientX = this.startX
      this.centerX = ((this.startX - $('body').offset().left) / 2) + $('body').offset().left
      this.stopX = ($('.cartImg').offset().left + ($('.icon-all').width() / 2)) + ($('.addCartPng').width() / 2)
      this.vx = (this.startX - $('body').offset().left) / 20
      // $('#cart_goods_count').val(cart_goods_count)
      $('.quantity').removeClass('addAnimate')
      clearTimeout(this.addTimer)
      clearTimeout(this.delTimer)
      this.startX = this.clientX
      this.moveY = 20
      $('.red-dot').css({
        'left': this.startX + 'px',
        'bottom': this.moveY + 'px',
        'display': 'block'
      })
      this.addMove()
    },
    delMove() {
      this.startX -= this.vx
      this.moveY -= this.vy
      $('.red-dot').css({
        'left': this.startX + 'px',
        'bottom': this.moveY + 'px'
      })
      if ((this.startX - $('body').offset().left) >= this.stopX) {
        this.delTimer = setTimeout(this.delMove, this.timer)
      } else {
        clearTimeout(this.addTimer)
        $('.red-dot').css('display', 'none')
        // var cart_goods_count = parseInt($('#cart_goods_count').val())
        $('.quantity').css('display', 'block')
        $('.quantity').addClass('addAnimate')
      }
    },
    addMove() {
      this.startX -= this.vx
      this.moveY += this.vy
      $('.red-dot').css({
        'left': this.startX + 'px',
        'bottom': this.moveY + 'px'
      })
      if (this.startX <= this.centerX) {
        clearTimeout(this.delTimer)
        this.delMove()
      } else {
        this.addTimer = setTimeout(this.addMove, this.timer)
      }
    }
  }
}
</script>

<style scoped>
@import '/static/style/goods.css';
.container-content {
  background: #fff
}

.demo-swipe-item {
  text-align: center;
}
</style>
