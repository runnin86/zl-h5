<template>
<div>
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>订单详情</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{ name: 'Index',path: '/index' }">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <div class="mainDet row">
    <p class="title_p">订单信息</p>
    <div class="shopDet">
      <ul>
        <li>订单编号：{{orderDet.order.order_sn}}</li>
        <li v-if="this.$route.query.orderId">下单时间：{{orderDet.order.formated_add_time}}</li>
        <li v-else>下单时间：{{orderDet.order.add_time}}</li>
        <li>付款时间：{{orderDet.order.pay_time===0 ? '未付款' : orderDet.order.pay_time}}</li>
        <li>发货时间：{{orderDet.order.shipping_time===0 ? '未发货' : orderDet.order.shipping_time}}</li>
        <li>订单状态：{{orderDet.order.order_status}}</li>
      </ul>
    </div>
    <p class="title_p">收货人信息</p>
    <div class="shopDet">
      <ul>
        <li>收货人姓名：{{orderDet.order.consignee}}</li>
        <li>详细地址：{{orderDet.order.address}}</li>
        <li>联系电话：{{orderDet.order.mobile}}</li>
      </ul>
    </div>
    <p class="title_p">商品详情</p>
    <div class="shopDet" style="padding:0">
      <table>
        <tr v-for="g in orderDet.goods_list">
          <td><img :src="g.master_img" /></td>
          <td>
            <p class="g_name">{{g.goods_name}}</p>
            <span class="g_number">数量:{{g.goods_number}}</span>
            <span class="g_price">{{g.goods_price}}</span>
          </td>
          <td class="eval" v-if="evalChoose" @click="com_def">
            <a href="javascript:void(0)">评价</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="this.$route.query.orderId">
      <p class="title_p">其他信息</p>
      <div class="shopDet">
        <ul>
          <li>支付方式：{{orderDet.order.pay_name}}</li>
          <li>配送方式：{{orderDet.order.shipping_name}}</li>
          <li>商品总价：{{orderDet.order.formated_goods_amount}}</li>
          <li>已用优惠：￥{{orderDet.order.offset}}</li>
          <li>应付金额：{{orderDet.order.formated_order_amount}}</li>
        </ul>
      </div>
      <div class="button-sp-area" v-if="orderDet.order.pay_status === '未付款'">
        <a @click="doWechatPay" class="weui-btn weui-btn_primary">微信支付</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import wx from 'weixin-js-sdk'
import $ from 'zepto'
import qs from 'qs'
import * as config from './../../config'

export default {
  data() {
    return {
      orderDet: [],
      evalChoose: false,
      orderId: this.$route.query.orderId
    }
  },
  /*
   * 激活
   */
  activated() {
    // 获取数据
    this.loadDet()
    this.orderId = this.$route.query.orderId
  },
  /*
   * 模板编译之前
   */
  beforeMount () {
    // 获取签名等信息
    this.$http.get('http://127.0.0.1:8090/api/v1/weChat/wxConfig')
    .then(({data: {data, code, msg}}) => {
      // 微信配置
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          'chooseWXPay'
        ]
      })
    }, (response) => {
      // error callback
      console.error(response)
    })
  },
  methods: {
    /*
     * 获取数据
     */
    loadDet() {
      let query_choose = this.$route.query.orderId ? this.$route.query.orderId : this.$route.query.orderIdSell
      this.evalChoose = this.$route.query.orderId ? this.evalChoose = true : this.evalChoose = false
      let api_choose = query_choose === this.$route.query.orderId ? '/user.php?act=order_detail' : '/order_info_union.php'
      this.$http.get(api_choose, {
        params: {
          order_id: query_choose
        }
      }).then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // console.log(data)
          this.orderDet = data
        } else {
          console.log(errcode)
        }
      }, (response) => {
        console.log(response)
      })
    },
    // 评价判断
    com_def () {
      if (this.orderDet.order.pay_status === '已完成') {
        this.$route.path({name: 'CommentGoods', path: '/commentGoods', query: {order_id: this.orderDet.order.order_id, goods_id: this.orderDet.goods_list.goods_id}})
      } else {
        $.toast('确认收货后才能评论', 'forbidden')
      }
    },
    /*
     * 发起微信支付
     */
    doWechatPay() {
      // 发送请求
      let postData = {
        str: this.orderId, // 订单order_id：多个订单之间用','隔开
        pay_id: '3' // 支付方式
      }
      let zhis = this
      this.$http.post('flow.php?step=make_big', qs.stringify(postData))
      .then(({data: {data, errcode, msg}}) => {
        // console.log(JSON.parse(data.jsApiParameters).package)
        if (data.jsApiParameters) {
          window.WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(data.jsApiParameters),
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
              $.toast(res.err_desc, 'forbidden')
            }
          })
        }
      }, (response) => {
        // error callback
        console.log(response)
      })
      // wx.chooseWXPay({
      //   timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      //   nonceStr: '', // 支付签名随机串，不长于 32 位
      //   package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      //   signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      //   paySign: '', // 支付签名
      //   success: function (res) {
      //       // 支付成功后的回调函数
      //   }
      // })
    }
  }
}
</script>

<style>
.mainDet {
  margin-top: 44px;
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
  margin-top: 12px
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
