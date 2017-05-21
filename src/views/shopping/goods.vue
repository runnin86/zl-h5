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
    <div class="col-xs-8 shop-name">
      <!-- <span>{{goodData.goods.goods_name}}</span> -->
      <span class="double_title buyer_comment">商品详情</span>
      <router-link :to="{name: 'CommentList', path: '/commentList', query: {gid: goodData.id}}" class="double_title">买家评论</router-link>
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
            <img :src="imgBase64"
              :style="{backgroundImage: 'url(' + img_domain + img.resource + ')'}">
          </wv-swipe-item>
        </wv-swipe>
      </div>
    </div>
    <div class="row" style="margin:0px; margin-top:10px">
      <div class="col-xs-12 goodsTitle" v-if="main">
        <p>
          {{main.productName}}
          <span>
              <!-- <a style="  padding-top:33px; font-size:12px;" href="javascript:void(0);" data-toggle="modal" data-target=".bs-example-modal-sm"  class="app_share">分享</a> -->
          </span>
        </p>
        <div class="shop_price">
          {{main.price}}
          <span class="shop_price_span_add">
            市场价￥{{main.marketPrice}}
          </span>
          <div class="goodNum">
            <a class="add" href="javascript:void(0);" @click="numberChange('del')">-</a>
            <input type="text" v-model="goodNumber" name="number" />
            <a class="delete" href="javascript:void(0);" style="cursor:pointer" @click="numberChange('add')">+</a>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row" style="margin-left:0">
      <span class="dTimer">
          <span v-html="countDownTime"></span>
        </span>
    </div> -->
    <!-- <div class="row goodsProp">
      <div class="col-xs-12">
        <span class="color">颜色：</span>
        <div>
          <a title="无色" class="redBg redBgColor">{{goodUpc.color_name}}</a>&nbsp;
        </div>
      </div>
      <div class="col-xs-12">
        <span class="color">尺寸：</span>
        <div>
          <a title="通用" class="redBg redBgColor">{{goodUpc.size_name}}</a>&nbsp;
        </div>
      </div>
      <div class="col-xs-12">
        <span class="color">数量：</span>
        <div>
          <span class="add-del">
              <a class="add" href="javascript:void(0);" @click="numberChange('del')">-</a>
              <input type="text" v-model="goodNumber" name="number" />
              <a class="delete" href="javascript:void(0);" style="cursor:pointer" @click="numberChange('add')">+</a>
          </span>
        </div>
        <a href="javascript:void(0);" v-bind:class="['btn store_recommend', goodData.is_in_store ? 'store_recommended redBgColor' : '']" @click="addRecomend()" v-html="commendText"></a>
      </div>
    </div> -->
    <!-- <p class="detailTab redBorderColor">
      <span class="redBgColor">商品详情</span>
    </p> -->
  </div>
  <div class="row info_goods">
      <div class="col-xs-4" style="text-align:left">
        <img src="/static/images/zheng.png">&nbsp;正品保证
      </div>
      <div class="col-xs-4" style="text-align:center;">
        <img src="/static/images/qu.png">&nbsp;全球直采
      </div>
      <div class="col-xs-4" style="text-align:right;">
        <img src="/static/images/bao.png">&nbsp;满99包邮
      </div>
  </div>
  <div class="goodsTxt">
    <p class="redColor">#商品详情#</p>
  </div>
  <div class="goodsBrief" v-html="goodBrief"></div>
  <span class="red-dot"></span>
  <div class="cartBottom">
    <div class="cartImg clearfix">
      <router-link :to="'/cart'">
        <a href="javascript:void(0);" class="cart_png addCartPng">
          <span class="iconfont-yzg icon-yzg-msnui-cart"></span>
          <span class="quantity redBgColor" v-show="goodData.cart_goods_count>0">{{goodData.cart_goods_count}}</span>
        </a>
      </router-link>
      <a href="javascript:void(0);" @click="collect(goodData.id)" class="cart_png">
        <span v-bind:class="['iconfont-yzg', goodData.is_collect ? 'icon-yzg-shoucang' : 'icon-yzg-shouc_no']"></span>
      </a>
    </div>
    <div class="clearfix" style=" padding-left:40%;">
      <div class="tbl-cell">
        <a class="btn-cart redBgColor" href="javascript:void(0);" @click="addCart('0')">
          <span class="iconfont-yzg icon-yzg-msnui-cart"></span>加入购物车
        </a>
      </div>
      <!-- <div class="tbl-cell">
        <router-link :to="{ path: '/orderfill', query: { one_step_buy: 1 }}" class="btn-buy">
          <a href="javascript:void(0)" @click="addCart('1')" class="redBgColor">
            <span class="iconfont-yzg icon-yzg-goumai"></span>立即购买
          </a>
        </router-link>
      </div> -->
    </div>
  </div>
  <!--底部导航结束-->
  <div class="loading" v-if = "load">
    <i class="weui-loading"></i>
  </div>
</div>
</template>

<style scoped>
@import '/static/style/goods.css';
.container-content{ background: #fff}
.demo-swipe-item{
  text-align: center;
}
</style>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'
// var refreshMsg

export default {
  init() {
    // console.log('初始化')
  },
  created() {
    // refreshMsg = setInterval(this.GetRTime, 0)
  },
  beforeDestroy() {
    // window.clearInterval(refreshMsg)
  },
  activated() {
    this.loadGood()
    this.$store.commit('CHANGE_IS_INDEX', false)
    $('.red-dot').css({'left': this.startX + 'px', 'bottom': this.moveY + 'px'})
  },
  data() {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      goodNumber: '1', // 购买数量
      goodsCount: null, // 商品总数
      cartCount: null, // 购物车总数
      goodBrief: null, // 详情
      surplus: null, // 剩余数量
      goodData: {
        goods: {
          goods_name: ''
        }
      },
      goodUpc: [],
      countDownTime: '',
      commendText: '加为本店推荐',
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
      load: true   // 是否显示加载动画
    }
  },
  methods: {
    loadGood() {
      this.$http.get('/goods.php', {
        params: {
          id: this.$route.query.gid,
          page: this.pagenum
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          console.log(data)
          this.goodBrief = data.goods.goods_desc_m
          this.cartCount = data.cart_goods_count
          this.surplus = data.upc.number
          this.goodsCount = data.upc.number
          this.goodData = data
          this.goodUpc = data.upc
          // 微信分享初始化->(title, desc, imgUrl, link)
          let desc = '【南华汇】帅哥美女们，我当老板啦！快来我的小店逛逛，捧个场吧！不知道我当老板了？再不来【南华汇】逛逛，你就out了！'
          this.$parent.initWechatShare(
            data.page_title,
            desc,
            data.img_domain + data.goods_img[0].goods_thumb,
            window.location.href)
        } else {
          console.log(msg)
          console.error('获取商品列表失败:' + msg)
        }
        this.load = false
      }, (response) => {
        // error callback
        console.log(response)
      })
    },
    numberChange(opaeratType) { // 购买商品数量
      if (opaeratType === 'add') {
        if (this.surplus > 1) {
          this.goodNumber = this.goodNumber - (-1)
          this.surplus -= 1
        } else {
          weui.alert('库存不足，请选择其他商品')
        }
      } else {
        if (this.goodNumber > 1) {
          this.goodNumber -= 1
        } else {
          weui.alert('购买最小数量为1')
        }
      }
    },
    addCart(buyobj) {
      let _this = this
      let gd = {
        goods: JSON.stringify({
          'quick': 0,
          'spec': [],
          'goods_id': this.goodData.id,
          'number': this.goodNumber,
          'parent': 0,
          'upc_id': this.goodUpc.upc_id
        }),
        one_step_buy: buyobj,
        buy_type: 0,
        group_no: 0,
        seller_id: this.$store.getters.sellerId
      }
      this.$http.post('/flow.php?step=add_to_cart', qs.stringify(gd))
      .then(function({data: {data, errcode, msg}}) {
        if (errcode === 0) {
          if (buyobj === '0') {
            _this.moveCart()
            _this.goodData.cart_goods_count = data.cart_goods_count
          } else {
            console.log(data)
          }
        } else {
          weui.alert(msg)
        }
      })
      .catch(function(error) {
        console.log(error)
      })
    },
    collect() {
      let _this = this
      this.$http.get('/user.php', {
        params: {
          act: 'collect',
          id: this.goodData.id
        }
      })
      .then(function({data: {data, errcode, msg}}) {
        console.log('收藏' + msg)
        _this.goodData.is_collect = true
        weui.toast(msg, 2000)
      })
      .catch(function(error) {
        console.log('catch' + error)
      })
    },
    addRecomend() {
      let _this = this
      this.$http.post('/goods_union.php', {
        params: {
          act: 'push',
          id: this.goodData.id
        }
      })
      .then(function({data: {data, errcode, msg}}) {
        console.log('推荐' + msg)
        _this.goodData.is_in_store = true
        _this.commendText = '已为本店推荐商品'
        weui.toast(msg, 2000)
      })
      .catch(function(error) {
        console.log('catch' + error)
      })
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
      $('.red-dot').css({'left': this.startX + 'px', 'bottom': this.moveY + 'px', 'display': 'block'})
      this.addMove()
    },
    delMove() {
      this.startX -= this.vx
      this.moveY -= this.vy
      $('.red-dot').css({'left': this.startX + 'px', 'bottom': this.moveY + 'px'})
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
      $('.red-dot').css({'left': this.startX + 'px', 'bottom': this.moveY + 'px'})
      if (this.startX <= this.centerX) {
        clearTimeout(this.delTimer)
        this.delMove()
      } else {
        this.addTimer = setTimeout(this.addMove, this.timer)
      }
    },
    // 倒计时JS
    GetRTime() {
      var StartTime = new Date('2017/03/26 12:00:00') // 活动开始时间
      var NowTime = new Date()
      var t = StartTime.getTime() - NowTime.getTime() // 计算是否到轰动开始
      var textD // 剩余天数
      var textH // 剩余小时
      var textM // 剩余分钟
      var textS // 剩余秒
      var textInner // 提示
      // 若t 小于0，则活动已开始
      if (t < 0) {
        textInner = '离活动结束还有：'
        // 计算结束时间
        var EndTime = new Date('2017/05/19 12:00:00') // 活动结束时间
        t = EndTime.getTime() - NowTime.getTime()
        // 若 t 小于0，则活动已结束
        if (t < 0) {
          textInner = '活动已结束'
        }
      } else {
        textInner = '活动即将开始：'
      }
      // 计算开始或结束时间
      if (t > 0) {
        var d = Math.floor(t / 1000 / 60 / 60 / 24)
        var h = Math.floor(t / 1000 / 60 / 60 % 24)
        var m = Math.floor(t / 1000 / 60 % 60)
        var s = Math.floor(t / 1000 % 60)
        textD = d + '天 '
        textH = h + '时 '
        textM = m + '分 '
        textS = s + '秒 '
      } else {
        textD = ''
        textH = ''
        textM = ''
        textS = ''
      }
      this.countDownTime = textInner + textD + textH + textM + textS
    }
  }
}
</script>
