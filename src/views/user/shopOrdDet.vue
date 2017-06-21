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
      <router-link :to="{path: '/category'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>

  <div class="mainDet row" v-if="orderInfo">
    <p class="title_p">订单信息</p>
    <div class="shopDet">
      <ul>
        <li>订单编号：{{orderInfo.orderNo}}</li>
        <li>下单时间：{{orderInfo.orderDate/1000 | dateFilter(4)}}</li>
        <li>付款时间：{{orderInfo.payStatus===0 ? '未付款' : (orderInfo.payTime/1000 | dateFilter(4))}}</li>
        <li>发货时间：{{!orderInfo.shippingTime ? '未发货' : (orderInfo.shippingTime/1000 | dateFilter(4))}}</li>
        <li>订单状态：{{orderInfo.orderStatus | orderStatusFilter}}</li>
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
          <li>支付方式：{{orderInfo.moneySource ? orderInfo.moneySource: '微信支付'}}</li>
          <li v-if="orderInfo.shippingNo">配送单号：{{orderInfo.shippingNo}}</li>
          <li v-if="orderInfo.shipmentMoney>0">配送费用：{{orderInfo.shipmentMoney}}</li>
          <li>商品总价：{{orderInfo.totalPrice}}</li>
          <!-- <li>已用优惠：￥{{orderInfo.offset}}</li> -->
          <li>应付金额：{{orderInfo.totalPrice+orderInfo.shipmentMoney}}</li>
        </ul>
      </div>
      <div class="button-sp-area" v-if="orderInfo.payStatus === 0">
        <a @click="doWechatPay" class="weui-btn weui-btn_primary">微信支付</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import weui from 'weui.js'

export default {
  data() {
    return {
      orderNo: this.$route.query.orderNo,
      orderInfo: null,
      orderDetail: null,
      img_domain: 'http://img.zulibuy.com/images/'
    }
  },
  /*
   * 激活
   */
  activated() {
    this.orderNo = this.$route.query.orderNo
    // 获取数据
    this.loadOrderInfo()
  },
  methods: {
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
        } else {
          $.toast(msg, 'forbidden')
        }
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
    /*
     * 发起微信支付
     */
    doWechatPay() {
      // 发送请求
      let loading = weui.loading('loading')
      let postData = {
        sn: this.orderNo, // 订单order_id：多个订单之间用','隔开
        totalAmount: this.orderInfo.totalPrice + this.orderInfo.shipmentMoney // 金额
      }
      let zhis = this
      this.$http.post('weChat/weChartPay', qs.stringify(postData))
      .then(({data: {data, code, msg}}) => {
        if (code === 1) {
          if (data) {
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', data,
            function(res) {
              // err_code,err_desc,err_msg
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                $.toast('支付成功')
                setTimeout(() => {
                  zhis.$router.push({name: 'OrderList', params: {orderAct: 1}})
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
  margin-top: 20px; padding:20px;
}
</style>
