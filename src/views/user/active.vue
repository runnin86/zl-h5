<template>
<div>
  <div class="row nav-center">
    <div class="col-xs-2 backBtn">
    </div>
    <div class="col-xs-8 loginTitle">绑定</div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{path: '/index'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <div class="wdTable row">
    <table>
      <tr>
        <td>真实姓名</td>
        <td>
          <input class="form-control" v-model="name" placeholder="请填写真实姓名" />
        </td>
      </tr>
      <tr>
        <td>手机号码</td>
        <td>
          <input class="form-control" type="number" v-model="phone" placeholder="请填写手机号码" />
        </td>
      </tr>
      <!-- <tr>
        <td>推荐人</td>
        <td>
          <input class="form-control" type="text" v-model="parentPhone"
            :disabled="parentPhone?false:false" placeholder="请填写推荐人手机号码" />
        </td>
      </tr> -->
      <tr>
        <td colspan="2" style="text-align:center;color: #FF0000;">
          请仔细填写上述信息,一旦绑定后不可更改!
        </td>
      </tr>
    </table>
    <a @click="userActivate()" class="rightCash">立即绑定</a>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import weui from 'weui.js'

export default {
  activated() {
    // 去获取用户信息
    // this.getUserInfo()
    this.userInfo = JSON.parse(window.localStorage.getItem('zlUser'))
    if (this.userInfo) {
      if (this.userInfo.status === 1) {
        this.$router.push({path: '/userCenter'})
      }
    }
  },
  data() {
    return {
      phone: null,
      name: null,
      parentPhone: null
    }
  },
  methods: {
    /*
     * 获取用户信息
     */
    getUserInfo() {
      let param = {
        mid: this.$route.query.mid ? this.$route.query.mid : '',
        phone: ''
      }
      this.$http.post('user/userInfo', qs.stringify(param), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(function({data: {data, code, msg}}) {
        if (code === 1) {
          console.log(data)
          this.phone = data.redisUser.phone
          this.name = data.redisUser.name
          this.parentPhone = data.parentUser.phone
        } else {
          console.error(this.$route.query.mid, '根据mid获取用户失败!')
        }
      }.bind(this)).catch(function(e) {
        console.error(e)
      })
    },
    /*
     * 绑定微信
     */
    userActivate() {
      if (this.inputValid(this.phone, this.parentPhone, this.name)) {
        let zhis = this
        let param = {
          name: this.name,
          phone: this.phone,
          parentPhone: this.parentPhone
        }
        this.$http.post('user/activate', qs.stringify(param), {
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(function({data: {data, code, msg}}) {
          if (code === 1) {
            $.toast(msg)
            // 清除用户对象
            window.localStorage.removeItem('zlUser')
            setTimeout(() => {
              zhis.$router.push({path: '/userCenter'})
            }, 2000)
            // if (data.weChatPrePay) {
            //   // 微信支付
            //   window.WeixinJSBridge.invoke('getBrandWCPayRequest', data.weChatPrePay.jsApiParameters,
            //   function(res) {
            //     // err_code,err_desc,err_msg
            //     if (res.err_msg === 'get_brand_wcpay_request:ok') {
            //       // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            //       $.toast('支付成功')
            //       // 清除用户对象
            //       window.localStorage.removeItem('zlUser')
            //       setTimeout(() => {
            //         zhis.$router.push({name: 'OrderList', query: {orderAct: 1}})
            //       }, 2000)
            //     } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            //       // 取消
            //       $.toast('用户取消支付', 'cancel')
            //     } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            //       // 支付失败
            //       $.toast(res.err_msg, 'forbidden')
            //     } else {
            //       weui.alert(!res.err_msg ? '支付回调错误,请刷新重试!' : res.err_msg)
            //     }
            //   })
            // } else {
            //   $.toast(msg)
            //   setTimeout(() => {
            //     zhis.$router.push({name: 'OrderList', query: {orderAct: 1}})
            //   }, 2000)
            // }
          } else {
            weui.alert(msg)
          }
        }).catch(function(e) {
          console.error(e)
        })
      }
    },
    /*
     *输入验证
     */
    inputValid(phone, parentPhone, name) {
      if (!phone || !(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        weui.alert('手机号码为空或手机号格式填写不正确')
        return false
      }
      // if (!parentPhone) {
      //   weui.alert('推荐人信息不能为空')
      //   return false
      // }
      if (phone === parentPhone) {
        weui.alert('手机号码不能和推荐人手机号一致')
        return false
      }
      if (!name) {
        weui.alert('请填写真实姓名')
        return false
      }
      return true
    }
  }
}
</script>

<style>
.wdTable {
  margin-top: 50px;
  background: #fff;
  padding: 10px
}

.wdTable table {
  width: 100%
}

.wdTable table td {
  padding: 7px 5px
}

.wdTable table td:first-child {
  width: 80px;
  text-align: right;
  padding-right: 5px
}

.rightCash {
  display: block;
  background: #d6244f;
  /*width: 100px;*/
  height: 40px;
  line-height: 40px;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  border-radius: 8px;
  margin-top: 8px
}
</style>
