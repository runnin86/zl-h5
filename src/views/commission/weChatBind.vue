<template>
	<div>
		<div class="withDraw row">
			<table v-if="userInfo">
        <tr>
          <td>微信账号</td>
          <td>
						<input class="form-control" v-model="userInfo.weChat" placeholder="请填写微信账号" />
					</td>
        </tr>
        <tr>
          <td>真实姓名</td>
          <td>
						<input class="form-control"
						  v-if="userInfo" v-model="userInfo.name" placeholder="请填写真实姓名" />
					</td>
        </tr>
			</table>
			<a @click="chatBind()" class="rightCash">立即绑定</a>
		</div>
	</div>
</template>

<script>
import qs from 'qs'
import weui from 'weui.js'

export default {
  activated () {
    this.userInfo = JSON.parse(window.localStorage.getItem('zlUser'))
  },
  data() {
    return {
      userInfo: null
    }
  },
  methods: {
    /*
    * 绑定微信
    */
    chatBind() {
      if (this.inputValid(this.userInfo.name, this.userInfo.weChat)) {
        let zhis = this
        let name = this.userInfo.name
        let wc = this.userInfo.weChat
        let param = {
          'name': name,
          'weChat': wc,
          'type': 'weChat'
        }
        this.$http.post('user/bindInfo', qs.stringify(param), {
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(function({data: {data, code, msg}}) {
          if (code === 1) {
            // 没有缓存强制
            let winUserNhh = JSON.parse(window.localStorage.getItem('zlUser'))
            winUserNhh['weChat'] = wc
            winUserNhh['name'] = name
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
    },
    /*
    *输入验证
    */
    inputValid(name, weChat) {
      if (!name) {
        weui.alert('请填写真实姓名')
        return false
      }
      if (!weChat) {
        weui.alert('请填写微信账号')
        return false
      }
      return true
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
