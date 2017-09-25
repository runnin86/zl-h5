<template>
<div>
  <div class="row yzg-title" style="position:relative;width:auto;">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>订单详情</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{path: '/index'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>

  <div class="mainDet row" v-if="orderInfo">
    <p class="title_p">订单信息</p>
    <div class="shopDet">
      <ul>
        <li>
          订单编号：{{orderInfo.orderNo}}
        </li>
        <li>
          下单时间：{{orderInfo.orderDate/1000 | dateFilter(4)}}
        </li>
        <li v-if="orderInfo.payStatus===0">
          付款时间：未付款
        </li>
        <li v-else>
          付款时间：{{orderInfo.payTime/1000 | dateFilter(4)}}
        </li>
        <li v-if="!orderInfo.shipmentTime">
          发货时间：未发货
        </li>
        <li v-else>
          发货时间：{{orderInfo.shipmentTime/1000 | dateFilter(4)}}
        </li>
        <li>
          订单状态：{{orderInfo.orderStatus | orderStatusFilter}}
        </li>
      </ul>
    </div>
    <p class="title_p">收货人信息</p>
    <div class="shopDet">
      <ul>
        <li>收货人姓名：{{orderInfo.consignee}}</li>
        <li>联系电话：{{orderInfo.consigneePhone}}</li>
        <li>详细地址：{{orderInfo.shipmentAddress}}</li>
      </ul>
    </div>
    <p class="title_p">商品详情</p>
    <div class="shopDet" style="padding:0">
      <table>
        <tr v-for="g in orderDetail">
          <td><img :src="img_domain+g.img" /></td>
          <td>
            <p class="g_name">{{g.product_name}}</p>
            <span class="g_number">数量: {{g.nums}}</span>
            <span class="g_price"> ¥ {{g.price}}</span>
          </td>
          <td class="eval" v-if="1===2" @click="com_def">
            <a href="javascript:void(0)">评价</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="this.$route.query.orderNo">
      <p class="title_p">其他信息</p>
      <div class="shopDet">
        <ul>
          <li v-if="orderInfo.shippingNo">配送单号：{{orderInfo.shippingNo}}</li>
          <li v-if="orderInfo.shipmentMoney>0">配送费用：¥ {{orderInfo.shipmentMoney}}</li>
          <li>商品总价：¥ {{orderInfo.totalPrice}}</li>
          <li v-if="discount>0&&discountDesc">{{discountDesc}}：- {{discount}}</li>
          <li>应付金额：¥ {{totalPay}}</li>
          <li v-if="orderInfo.payStatus > 0">支付方式：{{orderInfo.moneySource}}</li>
        </ul>
      </div>
      <div v-if="orderInfo.payStatus === 0">
        <wv-radio title="选择支付方式" :fnName="'radioPay'"
          v-model="payType" :options="payOptions"></wv-radio>
      </div>
      <div class="button-sp-area" v-if="orderInfo.payStatus === 0">
        <a @click="doPay" class="weui-btn weui-btn_primary">{{payType}}</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import weui from 'weui.js'
let loading

export default {
  data() {
    return {
      img_domain: 'http://img.zulibuy.com/images/',
      orderNo: this.$route.query.orderNo,
      orderInfo: null,
      orderDetail: null,
      totalPay: 0, // 微信支付金额
      brokerage: 0, // 佣金
      point: 0, // 积分
      discount: 0, // 抵扣数目
      discountDesc: null, // 抵扣说明
      payType: '微信支付',
      payOptions: [{
        label: '微 信',
        value: '微信支付'
      }, {
        label: '积 分',
        value: '积分支付',
        disabled: false
      }, {
        label: '佣 金',
        value: '佣金支付',
        disabled: false
      }]
    }
  },
  /*
   * 激活
   */
  activated() {
    loading = weui.loading('加载中')
    this.orderNo = this.$route.query.orderNo
    this.totalPay = this.brokerage = this.point = this.discount = 0
    this.orderInfo = this.orderDetail = this.discountDesc = null
    this.payType = '微信支付'
    // 获取组件的事件通信
    this.$on('radioPay', function (v) {
      this.radioPay(v)
    })
    // 获取数据
    this.loadOrderInfo()
    // 获取账户
    this.getUseAccount()
  },
  methods: {
    /*
     * 获取用户账户
     */
    getUseAccount (token) {
      this.$http.get('user/account', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        if (code === 1) {
          this.point = Number(data.point.replace(/,/gi, ''))
          this.brokerage = Number(data.brokerage.replace(/,/gi, ''))
          this.payOptions[1].label = '积 分(' + this.point + ')'
          this.payOptions[2].label = '佣 金(' + this.brokerage + ')'
        }
      }).catch((e) => {
        console.error('获取账户失败:' + e)
      })
    },
    /*
     * 获取数据
     */
    loadOrderInfo() {
      this.$http.get('order/orderInfo', {
        params: {
          orderNo: this.$route.query.orderNo
        },
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        if (code === 1) {
          console.log(data)
          this.orderInfo = data.info
          this.orderDetail = data.detail
          this.totalPay = data.info.totalPrice + data.info.shipmentMoney
        } else {
          $.toast(msg, 'forbidden')
        }
        loading.hide()
      }, (response) => {
        console.log(response)
      })
    },
    // 评价判断
    com_def () {
      weui.alert('建设中,敬请期待....')
      // if (this.orderDet.order.pay_status === '已完成') {
      //   this.$route.path({name: 'CommentGoods', path: '/commentGoods', query: {order_id: this.orderDet.order.order_id, goods_id: this.orderDet.goods_list.goods_id}})
      // } else {
      //   $.toast('确认收货后才能评论', 'forbidden')
      // }
    },
    radioPay(v) {
      // console.log(1, v, this.payType)
      // 初始化支付数目
      let orderPrice = this.orderInfo.totalPrice + this.orderInfo.shipmentMoney
      this.discount = 0
      if (v === '积分支付') {
        /*
         * 积分支付逻辑处理
         */
        this.discountDesc = '积分抵扣'
        let pointPay = parseInt(orderPrice / 1.1)
        if (this.point < pointPay) {
          weui.alert('积分不足', function() {
            this.payType = '微信支付'
            this.totalPay = orderPrice
          }.bind(this))
        } else {
          // 积分支付不允许组合支付
          this.discount = pointPay
          this.totalPay = 0
        }
      } else if (v === '佣金支付') {
        /*
         * 佣金支付逻辑处理
         */
        this.discountDesc = '佣金抵扣'
        if (this.brokerage === 0) {
          weui.alert('佣金不足', function() {
            this.payType = '微信支付'
            this.totalPay = orderPrice
          }.bind(this))
        } else if (this.brokerage >= orderPrice) {
          this.discount = orderPrice
          this.totalPay = 0
        } else if (this.brokerage < orderPrice) {
          // 佣金小于商品价格时,要组合支付
          this.discount = this.brokerage
          this.totalPay = orderPrice - this.brokerage
        }
      } else if (v === '微信支付') {
        /*
         * 微信支付时还原所有设置
         */
        this.discount = 0
        this.discountDesc = null
        this.totalPay = orderPrice
      }
    },
    /*
     * 发起支付
     */
    doPay() {
      // 发送请求
      loading = weui.loading('加载中')
      let postData = {
        orderNo: this.orderNo,
        payType: this.payType
      }
      let zhis = this
      this.$http.post('order/orderPay', qs.stringify(postData), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        console.log(code, msg, data)
        if (code === 1) {
          if (data.weChatPrePay) {
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', data.weChatPrePay.jsApiParameters,
            function(res) {
              // err_code,err_desc,err_msg
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                $.toast('支付成功')
                setTimeout(() => {
                  zhis.$router.push({name: 'OrderList', query: {orderAct: 1}})
                }, 2000)
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                // 取消
                $.toast('用户取消支付', 'cancel')
              } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                // 支付失败
                $.toast(res.err_msg, 'forbidden')
              } else {
                weui.alert(!res.err_msg ? '支付回调错误,请刷新重试!' : res.err_msg)
              }
            })
          } else {
            $.toast(msg)
            setTimeout(() => {
              zhis.$router.push({name: 'OrderList', query: {orderAct: 1}})
            }, 2000)
          }
        } else {
          weui.alert(!msg ? '支付请求异常,请刷新重试!' : msg)
          console.error(msg)
        }
        loading.hide()
      }, (response) => {
        loading.hide()
        $.toast('服务器异常', 'forbidden')
        // error callback
        console.log(response)
      })
    },
    /*
     * 发起支付
     */
    doWechatPay() {
      // 发送请求
      loading = weui.loading('加载中')
      let postData = {
        sn: this.orderNo, // 订单order_id：多个订单之间用','隔开
        totalAmount: this.orderInfo.totalPrice + this.orderInfo.shipmentMoney // 金额
      }
      let zhis = this
      this.$http.post('weChat/weChatPay', qs.stringify(postData), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        if (code === 1) {
          if (data) {
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', data.jsApiParameters,
            function(res) {
              // err_code,err_desc,err_msg
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                $.toast('支付成功')
                setTimeout(() => {
                  zhis.$router.push({name: 'OrderList', query: {orderAct: 1}})
                }, 2000)
              } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                // 取消
                $.toast('用户取消支付', 'cancel')
              } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                // 支付失败
                $.toast(res.err_msg, 'forbidden')
              } else {
                weui.alert(!res.err_msg ? '支付回调错误,请刷新重试!' : res.err_msg)
              }
            })
          } else {
            weui.alert('没有获取到支付参数')
          }
        } else {
          weui.alert(!msg ? '支付请求异常,请刷新重试!' : msg)
          console.error(msg)
        }
        loading.hide()
      }, (response) => {
        loading.hide()
        $.toast('服务器异常', 'forbidden')
        // error callback
        console.log(response)
      })
    }
  }
}
</script>

<style>
.mainDet {
  /*margin-top: 44px;*/
  padding-bottom: 50px; background: #eee
}

.shopDet {
  background: #fff;
  padding: 4px 10px 10px;
}

.title_p{
  background: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #eee;
  color: #999;
  margin-top:10px;
}

.shopDet ul {
  margin: 0;
}

.shopDet ul li {
  height: 34px;
  line-height: 34px;
  color: #333;
}

.shopDet table {
  width: 100%;
}

.shopDet table tr td {
  padding:8px;
  vertical-align: top;
  font-size: 14px;
  height: 80px;
  overflow: hidden;
}

.shopDet table tr td img {
  width: 100%;
  height: auto;
}

.shopDet table tr td:first-child {
  width: 80px;
}

.shopDet table tr td .g_name {
  height: 18px;
  overflow: hidden;
  margin-bottom: 4px
}

/*.shopDet table tr td .gd_name {
  height: 34px;
  overflow: hidden;
}*/

.shopDet table tr td .g_number {
  color:#999;
  font-size:12px;
}

.shopDet table tr td .g_price {
  display: block;
  margin-top: 4px
}

.shopDet table tr .eval {
  width: 60px;
  text-align: left;
  vertical-align: middle;
  font-size:12px; padding:0;
}

.shopDet a,
.shopDet a:hover {
  padding: 5px 8px;
  color: #d6244f;
  border: 1px solid #d6244f;
  border-radius: 4px;
}

.button-sp-area {
  margin-top: 10px; padding:20px;
}
.weui-cells__title {
  background: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #eee;
  color: #999;
  margin-top:10px;
  margin-bottom: -0.1em;
}
.weui-check__label {
  padding-left: 22px;
}
</style>
