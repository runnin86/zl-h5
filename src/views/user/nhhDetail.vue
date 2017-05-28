<template>
  <div>
    <div class="row" >
      <div id="detail_content">
        <img src="/static/images/nhh/nhh_1.jpg">
        <img src="/static/images/nhh/nhh_2.jpg">
        <img src="/static/images/nhh/nhh_3.jpg">
        <img src="/static/images/nhh/nhh_4.jpg">
        <img src="/static/images/nhh/nhh_5.jpg">
        <img src="/static/images/nhh/nhh_6.jpg">
        <img src="/static/images/nhh/nhh_7.jpg">
        <img src="/static/images/nhh/nhh_8.jpg">
        <img src="/static/images/nhh/nhh_9.jpg">
        <img src="/static/images/nhh/nhh_10.jpg">
      </div>
      <div id="arrow_up"></div>
      <div class="weui_btn_area" id="btn_link">
        <a style="position: fixed;bottom: 30px; right: 0;width: 130px;text-align: center;color: #ed3366; font-weight: bold; font-size: 16px;" @click="pay()">
        <!-- <i class="iconfont-yzg icon-yzg-shangcheng"></i> -->
          <img src="/static/images/nhh/nhh.png" style=" width: 130px; display: block; margin-bottom: 5px;"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'

export default{
  data () {
    return {
      big_order_id: null,
      pay_id: null,
      shop_order_amount: null
    }
  },
  methods: {
    pay() {
      // 发送请求
      let postData = {
        order_type: 'shop', // 订单类型
        pay_id: this.pay_id, // 支付ID
        str: this.big_order_id // 支付订单号
      }
      let zhis = this
      this.$http.post('flow.php?step=make_big', qs.stringify(postData))
      .then(({data: {data, errcode, msg}}) => {
        console.log(data)
        if (data.jsApiParameters) {
          window.WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(data.jsApiParameters),
          function(res) {
            // err_code,err_desc,err_msg
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              zhis.$router.push({path: '/userCenter/setStore'})
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              // 取消取消
              // $.toast(res.err_desc, 'cancel')
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              // 支付失败
              // $.toast(res.err_desc, 'forbidden')
            }
          })
          // window.WeixinJSBridge.invoke('getBrandWCPayRequest', {
          //   'appId': 'wx2421b1c4370ec43b',
          //   // 公众号名称，由商户传入
          //   'timeStamp': '1395712654',
          //   // 时间戳，自1970年以来的秒数
          //   'nonceStr': 'e61463f8efa94090b1f366cccfbbb444',
          //   // 随机串
          //   'package': 'prepay_id=wx201612032137135b201de80e0666789657',
          //   'signType': 'MD5',
          //   // 微信签名方式：
          //   'paySign': '70EA570631E4BB79628FBCA90534C63FF7FADD89' // 微信签名
          // },
          // function(res) {
          //   if (res.err_msg === 'get_brand_wcpay_request:ok') {
          //     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          //   }
          // })
        } else {
          $.toast('没有获取到支付参数', 'forbidden')
        }
      }, (response) => {
        // error callback
        console.log(response)
      })
    }
  },
  activated () {
    /*
     * 获取支付大订单号
     */
    this.$http.get('/create.php?act=pay', {})
    .then(({data: {data, errcode, msg}}) => {
      console.log(data)
      if (errcode === 0) {
        this.big_order_id = data.big_order_id
        this.shop_order_amount = data.shop_order_amount
        this.pay_id = data.pay_id
      } else {
        $.toast(msg, 'forbidden')
        console.warn(errcode, msg, data)
      }
    }, (response) => {
      // error callback
      console.log(response)
    })
  }
}
</script>

<style>
.weui-tab__panel{padding-bottom: 0;}
  .btn_click{
    width: 100%;
    background: #1AAD19;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }
  #btn_link{
    position: fixed;
    bottom: 30px;
    margin: 0 auto;
    left: 0;
    right: 0;
    max-width: 640px;
    min-width: 320px;
    padding: 0 10px;
  }
  #detail_content img{width:100%;}
  #arrow_up{
    opacity: 0.5;
    position: fixed;
    bottom: 80px;
    right: 25px;
    width: 40px;
    height: 40px;
    background: #666;
    z-index: 99999;
    cursor: pointer;
    outline: none;
    display: none;
    color: #fff;
    border: 0;
    border-radius: 50%;
    overflow: hidden;
  }
  #arrow_up:before{
    content: '';
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
    content: "";
    display: block;
    position: absolute;
    overflow: hidden;
    border-top: 3px solid #fff;
    border-left: 3px solid #fff;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  #arrow_up:after{
    content: "";
    display: block;
    position: absolute;
    overflow: hidden;
    top: 10px;
    left: 18px;
    width: 0;
    height: 24px;
    border-left: 3px solid #fff;
  }
</style>
