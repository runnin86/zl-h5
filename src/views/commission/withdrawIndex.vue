<template>
<div>
  <div class="cashIndex row">
    <table>
      <tr>
        <td>
          可提现金额<br/><span class="redColor availMoney">￥{{moneyInfo?moneyInfo.brokerage:0}}</span>
        </td>
        <td @click="doWithdraw">
          提现
          <i class="iconfont-yzg icon-yzg-arrow"></i>
        </td>
      </tr>
      <tr @click="$parent.gotoAddress('/userCenter/withdrawIndex/settledRecord', {type:1})">
        <td>已结算佣金</td>
        <td>
          <span class="redColor">￥{{moneyInfo?moneyInfo.settled:0}}</span>
          <i class="iconfont-yzg icon-yzg-arrow"></i>
        </td>
      </tr>
      <tr @click="$parent.gotoAddress('/userCenter/withdrawIndex/settledRecord', {type:0})">
        <td>未结算佣金</td>
        <td>
          <span class="redColor">￥{{moneyInfo?moneyInfo.unsettled:0}}</span>
          <i class="iconfont-yzg icon-yzg-arrow"></i>
        </td>
      </tr>
      <tr @click="$parent.gotoAddress('/userCenter/withdrawIndex/record')">
        <td>
					 提现记录
				</td>
        <td>
          <i class="iconfont-yzg icon-yzg-arrow"></i>
        </td>
      </tr>
    </table>
  </div>
  <div class="cashIndex row">
    <table>
      <tr>
        <td>绑定银行卡</td>
        <td>
          <router-link :to="{ path:'/userCenter/withdrawIndex/bankBind'}">
            <span :class="userInfo && userInfo.bankCard ? 'blueColor' : ''">
              {{userInfo && userInfo.bankCard ? '已成功绑定' : '去设置'}}
            </span>
            <i class="iconfont-yzg icon-yzg-arrow"></i>
          </router-link>
        </td>
      </tr>
      <tr>
        <td>绑定支付宝</td>
        <td>
          <router-link :to="{ path:'/userCenter/withdrawIndex/alipayBind'}">
            <span :class="userInfo && userInfo.alipayId ? 'blueColor' : ''">
              {{userInfo && userInfo.alipayId ? '已成功绑定' : '去设置'}}
            </span>
            <i class="iconfont-yzg icon-yzg-arrow"></i>
          </router-link>
        </td>
      </tr>
      <tr>
        <td>绑定微信</td>
        <td>
          <router-link :to="{ path:'/userCenter/withdrawIndex/weChatBind'}">
            <span :class="userInfo && userInfo.weChat ? 'blueColor' : ''">
              {{userInfo && userInfo.weChat ? '已成功绑定' : '去设置'}}
            </span>
            <i class="iconfont-yzg icon-yzg-arrow"></i>
          </router-link>
        </td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'

export default {
  data() {
    return {
      moneyInfo: null,
      userInfo: null
    }
  },
  activated() {
    this.moneyInfo = null
    this.userInfo = JSON.parse(window.localStorage.getItem('zlUser'))
    this.getWithdrawMoney()
  },
  methods: {
    /*
     * 获取提现金额汇总
     */
    getWithdrawMoney() {
      this.$http.post('user/withdrawMoney', {}, {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        if (code === 1) {
          // console.log(data)
          this.moneyInfo = data
        } else {
          $.toast(msg, 'forbidden')
        }
      }).catch((e) => {
        console.error('获取提现金额汇总失败:', e)
      })
    },
    /*
     * 提现点击事件
     */
    doWithdraw() {
      if (this.moneyInfo.brokerage > 0) {
        this.$router.push('/userCenter/withdrawIndex/withdraw')
      } else {
        weui.alert('当前没有可提现金额')
      }
    }
  }
}
</script>

<style>
.availMoney {
  font-size: 18px;
  font-weight: bold;
  padding-top: 5px;
  display: inline-block;
}

.blueColor {
  color: #09902d;
}

.cashIndex {
  /* margin-top: 50px; */
  background: #fff;
  padding: 10px;
}

.cashIndex table {
  width: 100%;
}

.cashIndex table td {
  padding: 12px 5px;
  vertical-align: bottom;
  border-bottom: 1px solid #f1f1f1;
}

.cashIndex table td:first-child {
  width: 50%;
  text-align: left;
  padding-right: 5px;
}

.cashIndex table td:last-child {
  width: 50%;
  text-align: right;
  padding-right: 5px;
}
</style>
