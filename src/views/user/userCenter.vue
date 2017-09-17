<template>
<div class="ucenter" @click="clearStorage" style="margin-bottom:0.6rem;">
  <div class="row index-title" style="padding-bottom: 1.2rem;">
    <div class="shop-name" @click="linkChange" style="padding:0.4rem 0 0">
      <div class="user-img" v-if="userInfo">
        <img :src="imgBase64" :style="{backgroundImage: 'url(' + userInfo.headImgUrl + ')'}">
      </div>
      <!-- <div class="set">
        <img src="/static/images/newIcon/set.png" />
        <span>设置</span>
      </div> -->
    </div>
    <div class="shop-detail clearfix">
      <div class="shop-info" v-if="userInfo">
        <span class="nhh-store_name" v-if="userInfo.nickName">{{userInfo.nickName}}</span>
        <span class="nhh-store_name" v-else>{{userInfo.name}}</span>
        <span class="info">足力购欢迎您~</span>
      </div>
    </div>
  </div>
  <div class="ucenter_seller">
    <div class="float_block">
      <div class="row month-order" v-if="accountInfo">
        <div class="col-xs-4">
          <span class="number_font" v-if="parseFloat(accountInfo.advance) > 0">
            {{accountInfo.advance}}
          </span>
          <span class="number_font" v-else>0.00</span>
          <p class="text_font">保证金</p>
        </div>
        <div class="col-xs-4">
          <span class="number_font" v-if="parseFloat(accountInfo.brokerage) > 0">
            {{accountInfo.brokerage}}
          </span>
          <span class="number_font" v-else>0.00</span>
          <p class="text_font">佣金</p>
        </div>
        <div class="col-xs-4">
          <span class="number_font" v-if="parseFloat(accountInfo.point) > 0">
            {{accountInfo.point}}
          </span>
          <span class="number_font" v-else>0.00</span>
          <p class="text_font">积分</p>
        </div>
      </div>
    </div>
    <div class="row iconroom">
      <div class="col-xs-4">
        <router-link to="/userCenter/sellerIncome">
          <img src="/static/images/newIcon/shouru.png" />
          <span class="text_font">我的佣金</span>
        </router-link>
      </div>
      <div class="col-xs-4">
        <router-link to="/userCenter/withdrawIndex">
          <img src="/static/images/newIcon/yongjin.png">
          <span class="text_font">佣金提现</span>
        </router-link>
      </div>
      <div class="col-xs-4" @click="building()">
        <router-link to="">
          <img src="/static/images/newIcon/userManage.png">
          <span class="text_font">我的团队</span>
        </router-link>
      </div>
    </div>
  </div>
  <div class="row ucenter_buyer">
    <div class="my-order_lists">
      <router-link :to="{name: 'OrderList', params: {orderAct: -1}}">
        <div class="all_list">
          <div class="my_order">
            <span>我的订单</span>
          </div>
          <div class="check-all_list">
            查看全部订单
            <span class="iconfont-yzg icon-yzg-arrow"></span>
          </div>
        </div>
      </router-link>
      <div class="list_status">
        <ul>
          <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 0}}">
            <img src="/static/images/newIcon/daifukuan.png" class="payment" />
            <span class="text_font">待付款</span>
          </router-link>
          <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 1}}">
            <img src="/static/images/newIcon/daifahuo.png" class="send_goods" />
            <span class="text_font">待发货</span>
          </router-link>
          <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 2}}">
            <img src="/static/images/newIcon/daishouhuo.png" class="receive_goods" />
            <span class="text_font">待收货</span>
          </router-link>
          <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 4}}">
            <img src="/static/images/newIcon/shouhou.png" class="after-sales" />
            <span class="text_font">退款/售后</span>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="help-center my-shop">
      <ul>
        <li class="arrow_position">
          <img src="/static/images/newIcon/coupon.png" />
          <router-link to="/userCenter/shareQRCode" class="text_font">二维码
            <span class="iconfont-yzg icon-yzg-arrow"></span>
          </router-link>
        </li>
        <li class="arrow_position">
          <img src="/static/images/newIcon/dizhi.png" />
          <router-link to="/userCenter/addressList" class="text_font">地址管理
            <span class="iconfont-yzg icon-yzg-arrow"></span>
          </router-link>
        </li>
        <!-- <li class="arrow_position">
          <img src="/static/images/newIcon/shoucang.png" />
          <router-link to="/userCenter/myCollect" class="text_font">我的收藏
            <span class="iconfont-yzg icon-yzg-arrow"></span>
          </router-link>
        </li> -->
        <!-- <li class="arrow_position">
          <img src="/static/images/newIcon/coupon.png" />
          <router-link to="/userCenter/myCoupon" class="text_font">我的优惠券
            <span class="iconfont-yzg icon-yzg-arrow"></span>
          </router-link>
        </li> -->
        <!-- <li class="arrow_position">
          <img src="/static/images/newIcon/coupon.png" />
          <router-link to="/userCenter/myAuction" class="text_font">我的拍卖
            <span class="iconfont-yzg icon-yzg-arrow"></span>
          </router-link>
        </li> -->
        <!-- <li @click="building()">
            <img src="/static/images/newIcon/guanyu.png"/>
            <router-link to="" class="text_font">关于我们</router-link>
          </li> -->
        <li class="contactSer">
          <img src="/static/images/newIcon/kefu.png" />
          <a href="tel:0312-7333023" class="text_font">联系客服
              <span>0312-7333023</span>
            </a>
        </li>
      </ul>
    </div>
  </div>

  <div class="row quit" style="margin-top:15px;display:none;">
    <div class="col-xs-12">
      <a href="/user.php?act=logout" class="btn">退出当前账号</a>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'

let weuiObj

export default {
  activated() {
    this.counter = 0
    this.userInfo = JSON.parse(window.localStorage.getItem('zlUser'))
    if (this.userInfo) {
      let token = window.localStorage.getItem('zlToken')
      if (this.userInfo.status === 0) {
        this.$router.push('/userCenter/active')
      } else {
        // 获取账户
        this.getUseAccount(token)
      }
    } else {
      // 进入登录页面
      this.$router.push('login')
    }
  },
  deactivated() {
    if (weuiObj) {
      // 组件去激活时weui弹窗要隐藏
      weuiObj.hide()
    }
  },
  data() {
    return {
      userInfo: null,
      accountInfo: null,
      storeinfo: '',
      incomeObj: '',
      info: '',
      is_shop: false,
      is_paid: '0',
      counter: 0,
      headImg: '/static/images/store/user_pa.jpg',
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII='
    }
  },
  methods: {
    building() {
      weuiObj = weui.alert('建设中,敬请期待....', function() {
        this.counter = 0
      }.bind(this))
    },
    /*
     * 获取用户账户
     */
    getUseAccount(token) {
      this.$http.get('user/account', {
        headers: {
          'x-token': token
        }
      }).then(({
        data: {
          code,
          data,
          msg
        }
      }) => {
        if (code === 1) {
          // console.log(data)
          this.accountInfo = data
        } else {
          $.toast(msg, 'forbidden')
          if (msg === 'token失效') {
            window.localStorage.removeItem('zlUser')
            // 进入登录页面
            this.$router.push('login')
          }
        }
      }).catch((e) => {
        console.error('获取账户盈利失败:' + e)
      })
    },
    linkChange() {
      if (this.is_shop) {
        this.$router.push('/userCenter/accountManage')
      } else {
        this.counter = 0
        // weuiObj = weui.alert('您还未开店，无法进行设置', function() {
        //   this.counter = 0
        // }.bind(this))
      }
    },
    transformLink() {
      if (this.is_paid) {
        this.$router.push('/userCenter/setStore')
      } else {
        this.$router.push('/nhhDetail')
      }
    },
    /*
     * 退出
     */
    logout() {
      weuiObj = weui.loading('退出中')
      let token = this.$store.getters.token
      this.$http.delete('user/logout', {
        headers: {
          'x-token': token
        }
      }).then(({
        data: {
          data,
          code,
          msg
        }
      }) => {
        console.log(code, data, msg)
        if (code === 1) {
          window.localStorage.removeItem('zlUser')
          window.localStorage.removeItem('zlToken')
          this.$router.push({
            path: '/category',
            replace: true
          })
        }
        $.toast(msg)
        weuiObj.hide()
      }).catch((e) => {
        weuiObj.hide()
        console.error('用户退出失败:' + e)
      })
    },
    clearStorage() {
      this.counter += 1
      if (this.counter === 20) {
        let zhis = this
        weuiObj = weui.dialog({
          title: '当前用户缓存',
          content: JSON.stringify(this.userInfo) + window.localStorage.getItem('zlToken'),
          className: 'custom-classname',
          buttons: [{
            label: '关闭',
            type: 'default',
            onClick: function() {
              // cancel
            }
          }, {
            label: '清除',
            type: 'primary',
            onClick: function() {
              window.localStorage.clear()
              // 进入鉴权页面
              zhis.$router.push('/')
            }
          }]
        })
        this.counter = 0
      }
    }
  }
}
</script>

<style scoped>
@import '/static/style/ucenter.css';
.pull-left {
  float: left;
}

.self_sign {
  font-size: 12px;
  height: 36px;
  overflow: hidden
}

.self_sign span {
  font-size: 12px;
}

.ucenter_buyer {
  background: #f8f8f8
}

.icon-yzg-customer-mgr {
  color: #227572
}

.icon-yzg-yongjin {
  color: #12b909
}

.icon-yzg-xin {
  color: #d31947;
}

.shop-info .nhh-store_name {
  font-size: 0.6rem;
  display: block;
  margin-bottom: 0.1rem;
  font-weight: light;
  color: #fff;
}

.contactSer a {
  position: relative;
}

.contactSer span {
  position: absolute;
  right: 0.768rem;
  color: #333;
  font-size: 0.5973rem;
}

.arrow_position a {
  position: relative;
}

.arrow_position span {
  position: absolute;
  right: 0.64rem;
  color: #333;
  font-size: 0.5973rem;
}

.index-title .shop-name {
  padding: 0.64rem 0 0.4rem;
}

.index-title .shop-detail .shop-info .info {
  height: 0.768rem;
  padding: 0 0.8533rem;
}

.row.index-title {
  background: url(/static/images/index_bg.jpg) no-repeat center top;
  position: relative;
}
</style>
