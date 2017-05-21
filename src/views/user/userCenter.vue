<template>
  <div class="ucenter ucenter_buyer" @click="clearStorage">
    <div class="row">
      <div class="col-xs-12 ucenter-top ">
        <a @click="linkChange">
          <img class="pull-left" src="static/images/store/user_pa.jpg"/>
          <div class="pull-left top-title clearfix">
            <div class="title clearfix" style=" color:#fff; position:relative;">
              <p>
                <span v-if="storeinfo">{{storeinfo.store_name}}</span>
                <span v-else>{{info.nickname}}</span>
              </p>
              <p class="self_sign">
                个性签名:
                <span v-if="storeinfo.signature">{{storeinfo.signature}}</span>
                <span v-else>开店后可点击头像设置自己的个性签名哦</span>
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="row ucenter_buyer">
      <div class="my-order_lists">
        <router-link :to="{name: 'OrderList', params: {orderAct: 'order_all'}}">
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
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_unpay'}}">
              <i class="iconfont-yzg icon-yzg-daifukuan"></i>
              <span>待付款</span>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_payed'}}">
              <i class="iconfont-yzg icon-yzg-plane"></i>
              <span>待发货</span>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_done'}}">
              <i class="iconfont-yzg icon-yzg-icon83"></i>
              <span>待收货</span>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_cancel'}}">
              <i class="iconfont-yzg icon-yzg-tuikuan"></i>
              <span>退款/售后</span>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="help-center my-shop">
        <ul>
          <li>
            <i class="iconfont-yzg icon-yzg-dizhiguanli"></i>
            <router-link to="/userCenter/addressList">地址管理</router-link>
          </li>
          <!-- <li>
            <i class="iconfont-yzg icon-yzg-aaa"></i>
            <router-link to="">我的团购</router-link>
          </li> -->
          <li>
            <i class="iconfont-yzg icon-yzg-shoucang1"></i>
            <router-link to="/userCenter/myCollect">我的收藏</router-link>
          </li>
          <li @click="building()">
            <i class="iconfont-yzg icon-yzg-guanyuwomen"></i>
            <router-link to="">关于我们</router-link>
          </li>
          <li @click="building()">
            <i class="iconfont-yzg icon-yzg-kefu"></i>
            <router-link to="">联系客服</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="row quit" style="margin-top:15px;">
      <div class="col-xs-12">
        <a @click="logout()" class="btn">退出当前账号</a>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'zepto'
import {mapGetters} from 'vuex'
import weui from 'weui.js'

export default {
  computed: {
    ...mapGetters({
      // 键为在当前页面展示,值为modules中getters中定义的键
      userInfo: 'userInfo'
    })
  },
  activated() {
    this.counter = 0
    if (!this.userInfo) {
      // 获取用户收入
      this.loadIncome()
    } else {
      // 进入登录页面
      this.$router.push('login')
    }
  },
  data () {
    return {
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
    loadIncome () {
      this.$http.get('/user.php', {
        params: {
          act: 'default'
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.incomeObj = data
          this.is_shop = data.is_shop
          this.storeinfo = data.storeinfo
          this.info = data.info
          this.is_paid = data.is_paid
          // console.log(data)
        } else {
          $.toast(msg, 'forbidden')
          console.warn(errcode, msg, data)
        }
      }, (response) => {
        console.error(response)
      })
    },
    linkChange () {
      if (this.is_shop) {
        this.$router.push('/userCenter/accountManage')
      } else {
        this.$router.push('')
        weui.alert('您还未开店，无法进行设置', function() {
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
      let token = this.$store.getters.token
      this.$http.delete('user/logout', {
        headers: {
          'x-token': token
        }
      })
      .then(({data: {data, code, msg}}) => {
        console.log(code, data, msg)
        if (code === 1) {
          this.$store.commit('LOGOUT')
          this.$router.push({path: '/category', replace: true})
        }
        $.toast(msg)
      }).catch((e) => {
        console.error('用户退出失败:' + e)
      })
    },
    clearStorage () {
      this.counter += 1
      if (this.counter === 5) {
        let zhis = this
        weui.dialog({
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
.pull-left{float: left;}
.self_sign{font-size:12px;height:36px;overflow: hidden}
.self_sign span{font-size:12px;}
.ucenter_buyer{ background: #f8f8f8 }
</style>
