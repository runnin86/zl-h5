<template>
  <div class="ucenter ucenter_buyer" @click="clearStorage">
    <div class="row" v-show="userInfo" v-cloak>
      <div class="col-xs-12 ucenter-top ">
        <a @click="building()" v-if="userInfo">
          <img class="pull-left" v-show="userInfo" :src="userInfo.headImgUrl"/>
          <div class="pull-left top-title clearfix">
            <div class="title clearfix" style=" color:#fff; position:relative;">
              <p v-if="userInfo">
                <span v-if="userInfo.nickName">{{userInfo.nickName}}</span>
                <span v-else>{{userInfo.name}}</span>
              </p>
              <p class="self_sign">
                个性签名:
                <span v-if="storeinfo.signature">{{storeinfo.signature}}</span>
                <span v-else>点击头像设置自己的个性签名哦</span>
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="ucenter_seller" v-if="accountInfo">
      <div class="row month-order">
        <div class="col-xs-4">
          <span v-if="parseFloat(accountInfo.advance) > 0">{{accountInfo.advance}}</span>
          <span v-else>0.00</span>
          <p>保证金</p>
        </div>
        <div class="col-xs-4">
          <span v-if="parseFloat(accountInfo.brokerage) > 0">{{accountInfo.brokerage}}</span>
          <span v-else>0.00</span>
          <p>佣金</p>
        </div>
        <div class="col-xs-4">
          <span v-if="parseFloat(accountInfo.point) > 0">{{accountInfo.point}}</span>
          <span v-else>0.00</span>
          <p>积分</p>
        </div>
      </div>
      <div class="row iconroom">
        <div class="col-xs-4">
          <router-link to="/userCenter/sellerIncome">
            <i class="iconfont-yzg icon-yzg-yongjin"></i>
            <span>我的佣金</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <router-link to="/userCenter/withdrawIndex">
          <a href="javascript:void(0);">
            <i class="iconfont-yzg icon-yzg-shangchengxitongtubiaozitihuayuanwenjian62-copy"></i>
            <span>佣金提现</span>
          </a>
          </router-link>
        </div>
        <div class="col-xs-4" @click="building()" >
          <router-link to="">
            <i class="iconfont-yzg icon-yzg-womendetuandui"></i>
            <span>我的团队</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="row ucenter_buyer">
      <div class="my-order_lists">
        <router-link :to="{name: 'OrderList', query: {orderAct: -1}}">
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
              <i class="iconfont-yzg icon-yzg-daifukuan"></i>
              <span>待付款</span>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 1}}">
              <i class="iconfont-yzg icon-yzg-plane"></i>
              <span>待发货</span>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 2}}">
              <i class="iconfont-yzg icon-yzg-icon83"></i>
              <span>待收货</span>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', query: {orderAct: 4}}">
              <i class="iconfont-yzg icon-yzg-tuikuan"></i>
              <span>退款/售后</span>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="help-center my-shop">
        <ul>
          <li>
            <i class="iconfont-yzg icon-yzg-share"></i>
            <router-link to="/userCenter/shareQRCode">二维码</router-link>
          </li>
          <li>
            <i class="iconfont-yzg icon-yzg-dizhiguanli"></i>
            <router-link to="/userCenter/addressList">地址管理</router-link>
          </li>
          <!-- <li>
            <i class="iconfont-yzg icon-yzg-aaa"></i>
            <router-link to="">我的团购</router-link>
          </li> -->
          <!-- <li>
            <i class="iconfont-yzg icon-yzg-shoucang1"></i>
            <router-link to="/userCenter/myCollect">我的收藏</router-link>
          </li> -->
          <!-- <li>
            <i class="iconfont-yzg icon-yzg-shezhi"></i>
            <router-link to="/userCenter/changePwd">修改密码</router-link>
          </li> -->
          <!-- <li @click="building()">
            <i class="iconfont-yzg icon-yzg-guanyuwomen"></i>
            <router-link to="">关于我们</router-link>
          </li> -->
          <li>
            <i class="iconfont-yzg icon-yzg-kefu"></i>
            <a href="tel:0312-7333023">
              联系客服
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="row quit" style="margin-top:4px;margin-bottom:40px;">
      <div class="col-xs-12">
        <a @click="logout()" class="btn">退出当前账号</a>
      </div>
    </div> -->
  </div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'

let weuiObj
export default {
  deactivated() {
    if (weuiObj) {
      weuiObj.hide()
    }
  },
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
  data () {
    return {
      userInfo: null,
      accountInfo: null,
      storeinfo: '',
      incomeObj: '',
      info: '',
      is_shop: false,
      is_paid: '0',
      counter: 0
    }
  },
  methods: {
    building() {
      weui.alert('建设中,敬请期待....', function() {
        this.counter = 0
      }.bind(this))
    },
    /*
     * 获取用户账户
     */
    getUseAccount (token) {
      this.$http.get('user/account', {
        headers: {
          'x-token': token
        }
      }).then(({data: {code, data, msg}}) => {
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
    linkChange () {
      if (this.is_shop) {
        this.$router.push('/userCenter/accountManage')
      } else {
        this.$router.push('')
        weui.alert('功能开发中...', function() {
          this.counter = 0
        }.bind(this))
      }
    },
    transformLink () {
      if (this.is_paid) {
        this.$router.push('/userCenter/setStore')
      } else {
        this.$router.push('/nhhDetail')
      }
    },
    /*
     * 退出
     */
    logout () {
      weuiObj = weui.loading('退出中')
      let token = this.$store.getters.token
      this.$http.delete('user/logout', {
        headers: {
          'x-token': token
        }
      }).then(({data: {data, code, msg}}) => {
        console.log(code, data, msg)
        if (code === 1) {
          window.localStorage.removeItem('zlUser')
          window.localStorage.removeItem('zlToken')
          this.$router.push({path: '/index', replace: true})
        }
        $.toast(msg)
        weuiObj.hide()
      }).catch((e) => {
        weuiObj.hide()
        console.error('用户退出失败:' + e)
      })
    },
    clearStorage () {
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
            onClick: function () {
              // cancel
            }
          }, {
            label: '清除',
            type: 'primary',
            onClick: function () {
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
.pull-left{
  float: left;
}
.self_sign{
  font-size: 12px;
  height: 36px;
  overflow: hidden
}
.self_sign span{
  font-size: 12px;
}
.ucenter_buyer{
  /*background: #f8f8f8;*/
}
</style>
