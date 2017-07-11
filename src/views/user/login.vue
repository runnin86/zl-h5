<template>
<div>
  <div v-show="oauthCode">
    <div class="row yzg-title" style="position:relative;width:auto;">
      <div class="col-xs-2 backBtn">
        <router-link :to="{path: '/category'}">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </router-link>
      </div>
      <div class="col-xs-8 shop-name">
        <span>登录</span>
      </div>
      <div class="col-xs-2 shop-bag">
        <router-link :to="{path: '/category'}">
          <span class="iconfont-yzg icon-yzg-fudaoshangcheng"></span>
        </router-link>
      </div>
    </div>

    <div style="margin-top:30px;">
      <div>
        <input type="number" v-model="userPhone"
          class="loginInput" placeholder="手机号码">
      </div>
      <a class="clear" style="margin-left: 80%;"
        :style="{display: userPhone?'block':'none'}"
        @click="userPhone=null"></a>

      <div>
        <input type="password" v-model="userPwd"
          class="loginInput" placeholder="密码">
      </div>
      <a class="clear" style="margin-left: 80%;"
        :style="{display: userPwd?'block':'none'}"
        @click="userPwd=null"></a>

      <div>
        <button @click="loginFun()" type="submit" class="btn btn-danger loginBtn">
					登录
				</button>
      </div>

      <div class="login_bottom row" style="display: none;">
        <span class="col-xs-8 account_add">
					我没有账号,去
					<a @click="state('register')">
						注册
					</a>
				</span>
        <a class="col-xs-4 pass_backadd" @click="state('passwordBack')">
					找回密码
				</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import weui from 'weui.js'
import * as config from './../../config'

let loading
export default {
  data() {
    return {
      loginState: 'login',
      userPhone: window.localStorage.getItem('localPhone') ? window.localStorage.getItem('localPhone') : '',
      userPwd: null,
      oauthCode: null
    }
  },
  activated() {
    this.userPwd = this.oauthCode = null
    // 不显示底部的菜单栏
    this.$store.commit('CHANGE_IS_INDEX', false)
    // 微信静默授权去获取到code提交至后台获取对应的openid
    if (!this.$parent.is_weixn()) {
      this.oauthCode = '123'
    } else {
      if (this.$route.query.code) {
        /*
         * 1.微信鉴权后获取code去登录
         */
        this.oauthCode = this.$route.query.code
      } else if (window.localStorage.getItem('zlUser')) {
        /*
         * 2.已登录
         */
        this.$router.replace({path: '/userCenter'})
      } else {
        /*
         * 3. 未登录->微信鉴权 051G0HDC1guKk00QzKDC1xlHDC1G0HDR
         */
        let appid = config.appId
        let redirect_uri = encodeURIComponent(window.location.href)
        // 应用授权作用域
        //   1:snsapi_base(不弹出授权页面,直接跳转,只能获取用户openid)
        //   2:snsapi_userinfo(弹出授权页面,可通过openid拿到昵称、性别、所在地。
        //    并且,即使在未关注的情况下,只要用户授权，也能获取其信息）
        let scopeType = 'snsapi_base'
        // 重定向后会带上state参数
        let innerParam = 'state'
        // 组装鉴权URL
        let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
        'appid=' + appid +
        '&redirect_uri=' + redirect_uri +
        '&response_type=code' +
        '&scope=' + scopeType +
        '&state=' + innerParam +
        '#wechat_redirect'
        window.location.href = oauthUrl
      }
    }
  },
  methods: {
    state(stateObj) {
      this.loginState = stateObj
    },
    loginFun() {
      window.localStorage.setItem('localPhone', this.userPhone)
      if (!this.userPhone) {
        $.toast('请输入用户名', 'forbidden')
        return
      }

      if (!this.userPwd) {
        $.toast('请输入密码', 'forbidden')
        return
      }

      let loginParam = {
        'uphone': this.userPhone,
        'upass': this.userPwd,
        'code': this.oauthCode
      }
      loading = weui.loading('登录中')
      this.$http.post('user/login', qs.stringify(loginParam))
      .then(function({data: {data, code, msg}}) {
        if (code === 1) {
          if (data.user.status === 0) {
            weui.alert('账户暂时不可用')
          } else if (data.user.status === 1) {
            $.toast('登录成功')
            window.localStorage.setItem('zlUser', JSON.stringify(data.user))
            window.localStorage.setItem('zlToken', data.token)
            this.$router.replace({path: '/category'})
          }
        } else {
          weui.alert(msg)
        }
        loading.hide()
      }.bind(this)).catch(function(e) {
        loading.hide()
        weui.alert('无法连接到服务器...')
        console.error('无法连接服务器:' + e)
      })
    }
  }
}
</script>

<style scoped>
@import '/static/style/login.css';
.loginInput {
  height: 50px;
  margin-bottom: 25px;
  width: 100%;
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.clear{
  background:no-repeat center center url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAflBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCtoPsAAAAKnRSTlMAAQIDBAUHCQoLDA0ODxASGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjOWCMFEAAABUklEQVR4Xo3U4W6CMBSG4a8dcyo4FUVAHCpa4bv/G1xiOJm1B9j7+0lz0rQHfibZlFeSzbnYriyGm2cPvtTmMfS+KgbVSwWatKPWIRgjOnGgy8yXXzcO5mJPPjhS9w0JUcPR2oVI88OJblFPUwH3YEyxeX/xckuFLXx5tLnY5EmPIg1M4UkDI/b8PLSXjQHEigSsDLUCkLEvhdg/aUr2lYB1DKwi2UVYkoFVJLnGhpqtAsk9SipWkaxxpWIVSQdHxSqSRMfAipyklZF7eAtOkbrFVZHquQ6lL+1zzlSxNTaKJBW7x1KTml3DulBqtouALJCqLV+e9l2kZ72njUpWjhEp9uXUi/8ND1ak2F7KocBu8HM3Igt5RPW/Vwai+/Qikubt9HqTFmNLM4HX5+C8zQxv2V2nyvwDYbMihNUceovMu4pHHmOkeFudHdmeT2lifPALZUK7MQNh4w4AAAAASUVORK5CYII=);
  background-size: 15px 15px;
  width:40px;
  height:40px;
  position: absolute;
  margin-top: -72px;
  /*margin: -2.76rem 0.2rem 0 86%;*/
  /*display: none;*/
}
</style>
