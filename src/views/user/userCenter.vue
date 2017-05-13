<template>
  <div class="ucenter">
    <div class="row">
      <div class="col-xs-12 ucenter-top ">
        <a @click="linkChange">
          <img  class="pull-left" src="static/images/store/user_pa.jpg"/>
          <div class="pull-left top-title clearfix">
            <div class="title clearfix" style=" color:#fff; position:relative;">
              <p>
                <span v-if="storeinfo">{{storeinfo.store_name}}</span>
                <span v-else>{{info.nickname}}</span>
              </p>
              <!-- <i class="iconfont-yzg icon-yzg-shezhi"></i> -->
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
    <div class="ucenter_seller" v-if="is_shop">
      <div class="row month-income">
        <router-link to="/userCenter/sellerIncome">
          <span>{{incomeObj.commission_total}}</span>
          <p>累计收入</p>
          <i class="iconfont-yzg icon-yzg-arrow"></i>
        </router-link>
      </div>
      <div class="row month-order">
        <div class="col-xs-4">
          <span v-if="incomeObj.month_self_support_total_amount">{{incomeObj.month_self_support_total_amount}}</span>
          <span v-else>0.00</span>
          <p>本月销售额</p>
        </div>
        <div class="col-xs-4">
          <span>{{incomeObj.count_order}}</span>
          <p>本月订单数</p>
        </div>
        <div class="col-xs-4">
          <span v-if="incomeObj.month_self_support_amount">{{incomeObj.month_self_support_amount}}</span>
          <span v-else>0.00</span>
          <p>本月收入</p>
        </div>
      </div>
      <div class="row iconroom">
        <div class="col-xs-4">
          <router-link to="/userCenter/sellerIncome">
            <i class="iconfont-yzg icon-yzg-shouru"></i>
            <span>我的收入</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <router-link to="/userCenter/orderManage">
            <i class="iconfont-yzg icon-yzg-sellerOrder"></i>
            <span>订单管理</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <router-link to="/userCenter/goodsShare">
            <i class="iconfont-yzg icon-yzg-share"></i>
            <span>商品分享</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <router-link to="/userCenter/personnelsManage">
            <i class="iconfont-yzg icon-yzg-customer-mgr"></i>
            <span>客户管理</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <router-link to="/userCenter/withdrawIndex">
            <i class="iconfont-yzg icon-yzg-yongjin"></i>
            <span>佣金提现</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <router-link to="">
            <i class="iconfont-yzg icon-yzg-xin"></i>
            <span>新手必读</span>
          </router-link>
        </div>
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
              <a>
                <img src="static/images/dfukuan.png">
                <span>待付款</span>
              </a>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_payed'}}">
              <a>
                <img src="static/images/dfahuo.png">
                <span>待发货</span>
              </a>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_done'}}">
              <a>
                <img src="static/images/dshouhuo.png">
                <span>待收货</span>
              </a>
            </router-link>
            <router-link tag="li" :to="{name: 'OrderList', params: {orderAct: 'order_cancel'}}">
              <a>
                <img src="static/images/shouhou.png">
                <span>退款/售后</span>
              </a>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="help-center my-shop">
        <ul>
          <li class="receive-address">
            <router-link to="/userCenter/addressList">地址管理</router-link>
          </li>
          <li class="shop-pintuan">
            <router-link to="">我的团购</router-link>
          </li>
          <li class="my-collect">
            <router-link to="/userCenter/myCollect">我的收藏</router-link>
          </li>
          <li class="shop-order">
            <router-link to="">关于我们</router-link>
          </li>
          <li class="shop-order">
            <router-link to="">联系客服</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="row ucenter_buyer" v-if="!is_shop">
      <div class="set-shop">
        <a href="javascript:void(0)" @click="transformLink()">
          <img src="static/images/lc-bg.png">
        </a>
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
    if (this.userInfo !== null) {
      // 获取用户收入
      this.loadIncome()
    } else {
      this.$router.push('login')
    }
  },
  data () {
    return {
      storeinfo: '',
      incomeObj: '',
      info: '',
      is_shop: false,
      is_paid: '0'
    }
  },
  methods: {
    loadIncome () {
      this.$http.get('user.php', {
        act: 'default'
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.incomeObj = data
          this.is_shop = data.is_shop
          this.storeinfo = data.storeinfo
          this.info = data.info
          this.is_paid = data.is_paid
          console.log(data)
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
        weui.alert('您还未开店，无法进行设置')
      }
    },
    transformLink () {
      if (this.is_paid) {
        this.$router.push('/userCenter/setStore')
      } else {
        this.$router.push('/userCenter/nhhDetail')
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
</style>
