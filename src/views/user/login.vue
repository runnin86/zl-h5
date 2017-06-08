<template>
<div>
  <div>
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
          class="loginInput" placeholder="手机号">
      </div>
      <div>
        <input type="password" v-model="userPwd"
          class="loginInput" placeholder="密码">
      </div>
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
  <!-- <div class="register" v-else-if="loginState=='register'">
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a href="javascript:history.back(-1)">
          <i class="iconfont-yzg icon-yzg-back" style=""></i>
        </a>
      </div>
      <div class="col-xs-8 loginTitle">
        注册
      </div>
      <div class="col-xs-2"></div>
    </div>
    <div>
      <ul>
        <li style="position:relative">
          <input type="text" class="form-control form-control_add" placeholder="手机号" name='username' id="username" onblur="">
        </li>
        <li>
          <div class="input-group form-control_add">
            <input type="text" class="form-control form-control_add" placeholder="请输入短信验证码" name="code">
            <span class="input-group-btn input-group-btn_add">
              <button class="btn getCode" type="button" id="btn" value="获取短信验证码" name="getcode" onclick="">
								获取验证码
							</button>
            </span>
          </div>
        </li>
        <li style="position:relative">
          <input type="text" value="15811088017" readonly="" class="form-control" style="height:50px;" placeholder="邀请者手机号,若无请留空" name="parentname" id="parentname">
          <span class="advice_teladd" id="parentname_span">
						*邀请者手机号
					</span>
        </li>
        <li style="position:relative">
          <input type="password" class="form-control form-control_add" placeholder="密码" name="password" onblur="">
        </li>
        <li style="line-height:30px;">
          <input type="checkbox" value="1" name="agreement" checked="checked"> 我同意服务协议
        </li>
        <li>
          <button type="submit" class="btn btn-danger loginBtn">
						注册
					</button>
        </li>
        <li class="login_bottom row">
          <span class="col-xs-8 account_add">
						我有账号,去
						<a @click="state('login')" class="login_add">
							登录
						</a>
					</span>
          <a class="col-xs-4 pass_backadd" @click="state('passwordBack')">
						找回密码
					</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="passwordBack" v-else>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a href="javascript:history.back(-1)">
          <i class="iconfont-yzg icon-yzg-back" style=""></i>
        </a>
      </div>
      <div class="col-xs-8 loginTitle">密码找回</div>
      <div class="col-xs-2">
      </div>
    </div>
    <div>
      <ul>
        <li style="position:relative">
          <input type="text" class="form-control form-control_add" placeholder="手机号" name='username' id="username" onblur="">
        </li>
        <li>
          <div class="input-group form-control_add">
            <input type="text" class="form-control form-control_add" placeholder="请输入短信验证码" name="code">
            <span class="input-group-btn input-group-btn_add">
              <button class="btn getCode" type="button" id="btn" value="获取短信验证码" name="getcode" onclick="">
								获取验证码
							</button>
            </span>
          </div>
        </li>
        <li>
          <button type="submit" class="btn btn-danger loginBtn">提交</button>
        </li>
        <li class="login_bottom row">
          <span class="col-xs-8 account_add">
						我没有账号,去
						<a @click="state('register')">
							注册
						</a>
					</span>
          <a class="col-xs-4 pass_backadd" @click="state('login')">
						去登录
					</a>
        </li>
      </ul>
    </div>
  </div> -->
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'

export default {
  data() {
    return {
      loginState: 'login',
      userPhone: window.localStorage.getItem('localPhone') ? window.localStorage.getItem('localPhone') : '',
      userPwd: null,
      submit: false
    }
  },
  activated() {
    this.userPwd = null
    // 不显示底部的菜单栏
    this.$store.commit('CHANGE_IS_INDEX', false)
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
        'code': '123'
      }
      this.$http.post('user/login', qs.stringify(loginParam))
      .then(function({data: {data, code, msg}}) {
        if (code === 1) {
          if (data.user.status === 0) {
            $.toast('账户暂时不可用', 'cancel')
          } else if (data.user.status === 1) {
            $.toast('登录成功')
            window.localStorage.setItem('zlUser', JSON.stringify(data.user))
            window.localStorage.setItem('zlToken', data.token)
            this.$router.replace({path: '/userCenter'})
          }
        } else {
          $.toast(msg, 'forbidden')
        }
      }.bind(this)).catch(function(e) {
        $.toast('连接失败...', 'forbidden')
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
</style>
