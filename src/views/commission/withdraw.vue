<template>
<div>
  <div class="withDraw row">
    <table>
      <tr>
        <td>可提现金额</td>
        <td>￥{{totalMoney}}</td>
      </tr>
      <tr>
        <td>本次提现</td>
        <td>
          <input class="form-control" v-model="withdrawMoney" type="number" placeholder="单笔最高2万" />
        </td>
      </tr>
      <tr>
        <td>提现账户</td>
        <td>
          <select class="form-control" v-model="withdrawType">
							<option value="0">请选择提现账户</option>
							<option value="1">银行卡提现</option>
							<option value="2">支付宝提现</option>
							<option value="3">微信提现</option>
						</select>
        </td>
      </tr>
    </table>
    <a class="btn redBgColor" @click="submitWithdraw" style="display:block;margin-top:10px;margin-bottom:10px;">立即提现</a>
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
      totalMoney: 0,
      withdrawMoney: null,
      withdrawType: 0
    }
  },
  activated() {
    this.totalMoney = this.withdrawType = 0
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
          this.totalMoney = data.brokerage
        } else {
          $.toast(msg, 'forbidden')
        }
      }).catch((e) => {
        console.error('获取提现金额汇总失败:', e)
      })
    },
    /*
     * 获取提现金额汇总
     */
    submitWithdraw() {
      if (this.withdrawMoney < 100) {
        weui.alert('提现金额必须大于100元!')
        this.withdrawMoney = null
        return
      }
      if (this.withdrawMoney > parseFloat(this.totalMoney)) {
        weui.alert('提现金额大于可提现金额!')
        this.withdrawMoney = null
        return
      }
      if (this.withdrawType === 0) {
        weui.alert('请选择提现账户!')
        this.withdrawType = 0
        return
      }
      // 参数
      let param = {
        wamount: this.withdrawMoney,
        wtype: this.withdrawType
      }
      loading = weui.loading('加载中')
      this.$http.post('user/withdraw', qs.stringify(param), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        if (code === 1) {
          this.withdrawMoney = null
          this.withdrawType = 0
          // 重新查询
          this.getWithdrawMoney()
          weui.alert('提现申请已提交，请等待审核')
        } else {
          weui.alert(msg)
        }
        loading.hide()
      }).catch((e) => {
        loading.hide()
        console.error('提现失败:' + e)
      })
    }
  }
}
</script>

<style>
.withDraw {
  background: #fff;
  padding: 10px;
}

.withDraw table {
  width: 100%;
}

.withDraw table td {
  padding: 7px 5px;
}

.withDraw table td:first-child {
  width: 80px;
  text-align: right;
  padding-right: 5px;
}

.rightCash {
  display: block;
  background: #d6244f;
  width: 140px;
  height: 36px;
  line-height: 36px;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  border-radius: 4px;
  margin-top: 18px;
}
</style>
