<template>
  <div>
    <div class="row yzg-title" style="position:relative;width:auto;">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>修改密码</span>
      </div>
    </div>

    <div style="margin-top:30px;">
      <div>
        <input type="password" v-model="oldPwd"
          class="loginInput" placeholder="旧密码">
      </div>
      <a class="clear" style="margin-left: 80%;"
        :style="{display: oldPwd?'block':'none'}"
        @click="oldPwd=null"></a>

      <div>
        <input type="password" v-model="newPwd"
          class="loginInput" placeholder="新密码">
      </div>
      <a class="clear" style="margin-left: 80%;"
        :style="{display: newPwd?'block':'none'}"
        @click="newPwd=null"></a>

      <div>
        <input type="password" v-model="confirmPwd"
          class="loginInput" placeholder="确认密码">
      </div>
      <a class="clear" style="margin-left: 80%;"
        :style="{display: confirmPwd?'block':'none'}"
        @click="confirmPwd=null"></a>

      <div>
        <button @click="pwdFun()" type="submit" class="btn btn-danger loginBtn">
					提交
				</button>
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
      oldPwd: null,
      newPwd: null,
      confirmPwd: null
    }
  },
  activated() {
    this.oldPwd = this.newPwd = this.confirmPwd = null
  },
  methods: {
    pwdFun() {
      if (!this.oldPwd) {
        $.toast('请输入旧密码', 'forbidden')
        return
      }

      if (!this.newPwd) {
        $.toast('请输入新密码', 'forbidden')
        return
      }

      if (!this.confirmPwd) {
        $.toast('请输入确认密码', 'forbidden')
        return
      }

      if (this.newPwd !== this.confirmPwd) {
        $.toast('两次密码不一致', 'forbidden')
        return
      }

      let pwdParam = {
        'opass': this.oldPwd,
        'npass': this.newPwd
      }
      this.$http.post('user/changePwd', qs.stringify(pwdParam), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(function({data: {data, code, msg}}) {
        console.log(data)
        if (code === 1) {
          $.toast(msg)
          window.localStorage.removeItem('zlUser')
          window.localStorage.removeItem('zlToken')
          this.$router.replace({path: '/login'})
        } else {
          this.oldPwd = null
          $.toast(msg, 'forbidden')
        }
      }.bind(this)).catch(function(e) {
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
  height: 46px;
  margin-bottom: 18px;
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
  margin-top: -62px;
  /*margin: -2.76rem 0.2rem 0 86%;*/
  /*display: none;*/
}
</style>
