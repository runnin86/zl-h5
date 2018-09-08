<template>
	<div>
		<div class="withDraw row">
			<table>
				<tr>
					<td>支付宝</td>
					<td>
						<input class="form-control"
						  v-if="userInfo" v-model="userInfo.alipayId" placeholder="请填写支付宝账号" />
					</td>
				</tr>
			</table>
			<a @click="binkAlipayId()" class="rightCash">立即绑定</a>
		</div>
	</div>
</template>

<script>
import qs from 'qs'
import weui from 'weui.js'

export default {
  activated() {
    this.userInfo = JSON.parse(window.localStorage.getItem('zlUser'))
  },
  data() {
    return {
      userInfo: null
    }
  },
  methods: {
    /*
    * 绑定支付宝
    */
    binkAlipayId() {
      if (!this.userInfo.alipayId) {
        weui.alert('请填写支付宝账号')
        return false
      }
      let zhis = this
      let aid = this.userInfo.alipayId
      let param = {
        'alipayId': aid,
        'type': 'alipay'
      }
      this.$http.post('user/bindInfo', qs.stringify(param), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(function({data: {data, code, msg}}) {
        if (code === 1) {
          // 没有缓存强制
          let winUserNhh = JSON.parse(window.localStorage.getItem('zlUser'))
          winUserNhh['alipayId'] = aid
          window.localStorage.setItem('zlUser', JSON.stringify(winUserNhh))
          // 提示和跳转
          weui.toast('绑定成功')
          setTimeout(() => {
            zhis.$parent.back()
          }, 2500)
        } else {
          weui.alert(msg)
        }
      }).catch(function(e) {
        console.error(e)
      })
    }
  }
}
</script>

<style>
	.withDraw{ background: #fff; padding:10px;}
	.withDraw table{ width:100%;}
	.withDraw table td{ padding:7px 5px; }
	.withDraw table td:first-child{ width:80px; text-align: right; padding-right:5px; }
	.rightCash{ display:block; background: #d6244f; width:100px; height:36px; line-height: 36px; color:#fff; margin:0 auto; text-align: center; border-radius:4px; margin-top:18px;}
</style>
