<template>
<div>
  <div class="login" v-if="loginState=='login'">
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.gotoAddress('index')">
					<i class="iconfont-yzg icon-yzg-back" style=""></i>
				</a>
      </div>
      <div class="col-xs-8 loginTitle">登录</div>
      <div class="col-xs-2">
      </div>
    </div>
    <form name="formLogin" action="/userCenter">
      <ul>
        <li style="position:relative">
          <input type="text" class="form-control form-control_add"
					  placeholder="手机号" name='username' id="username" onblur="">
        </li>
        <li style="position:relative">
          <input type="password" class="form-control form-control_add"
					  placeholder="密码" name='password' id='password' onblur="">
        </li>
        <li>
          <button to="/userCenter" :is-on="$route.path==='/userCenter'"
					  type="submit" class="btn btn-danger loginBtn">
						登录
					</button>
        </li>
        <li class="login_bottom row">
          <span class="col-xs-8 account_add">
						我没有账号,去
						<a href="javascript:void(0);" @click="state('register')">
							注册
						</a>
					</span>
          <a class="col-xs-4 pass_backadd" href="javascript:void(0);"
					  @click="state('passwordBack')">
						找回密码
					</a>
        </li>
      </ul>
    </form>
  </div>
  <div class="register" v-else-if="loginState=='register'">
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
    <form name="formLogin" action="userCenter" method="post">
      <ul>
        <li style="position:relative">
          <input type="text" class="form-control form-control_add"
					  placeholder="手机号" name='username' id="username" onblur="">
        </li>
        <li>
          <div class="input-group form-control_add">
            <input type="text" class="form-control form-control_add"
						  placeholder="请输入短信验证码" name="code">
            <span class="input-group-btn input-group-btn_add">
              <button class="btn getCode" type="button" id="btn" value="获取短信验证码" name="getcode" onclick="">
								获取验证码
							</button>
            </span>
          </div>
        </li>
        <li style="position:relative">
          <input type="text" value="15811088017" readonly="" class="form-control"
					  style="height:50px;" placeholder="邀请者手机号,若无请留空" name="parentname" id="parentname">
          <span class="advice_teladd" id="parentname_span">
						*邀请者手机号
					</span>
        </li>
        <li style="position:relative">
          <input type="password" class="form-control form-control_add"
					  placeholder="密码" name="password" onblur="">
        </li>
        <li style="line-height:30px;">
					<input type="checkbox" value="1" name="agreement" checked="checked">
					我同意服务协议
				</li>
        <li>
					<button type="submit" class="btn btn-danger loginBtn">
						注册
					</button>
				</li>
        <li class="login_bottom row">
          <span class="col-xs-8 account_add">
						我有账号,去
						<a href="javascript:void(0);" @click="state('login')" class="login_add">
							登录
						</a>
					</span>
          <a class="col-xs-4 pass_backadd" href="javascript:void(0);"
					  @click="state('passwordBack')">
						找回密码
					</a>
        </li>
      </ul>
    </form>
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
    <form name="formLogin" action="userCenter" method="post">
      <ul>
        <li style="position:relative">
          <input type="text" class="form-control form-control_add"
					  placeholder="手机号" name='username' id="username" onblur="">
        </li>
        <li>
          <div class="input-group form-control_add">
            <input type="text" class="form-control form-control_add"
						  placeholder="请输入短信验证码" name="code">
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
						<a href="javascript:void(0);" @click="state('register')">
							注册
						</a>
					</span>
          <a class="col-xs-4 pass_backadd" href="javascript:void(0);" @click="state('login')">
						去登录
					</a>
        </li>
      </ul>
    </form>
  </div>
  <div class="denglu">
    <div class="thirdLogin">
      <span>第三方登录</span>
      <a href="/third_login.php?type=wx">
				<img src="/static/images/wxicon.png"/>
			</a>
    </div>
  </div>
</div>
</template>

<script>
import qs from 'qs'
import md5 from 'md5'

export default {
  data() {
    return {
      loginState: 'login'
    }
  },
  activated () {
    // 不显示底部的菜单栏
    this.$store.commit('CHANGE_IS_INDEX', false)
    // 来源于微信授权的回调,根据回调值进行登录操作
    if (this.$route.query.code && this.$route.query.state) {
      this.login(this.$route.query.code)
    }
  },
  methods: {
    state(stateObj) {
      this.loginState = stateObj
    },
    login(code) {
      // 发送请求
      let timestamp = Date.parse(new Date()) / 1000
      let md5Str = md5('0' + timestamp + 'NhH$ApI')
      let postData = {
        uid: 0,
        timestamp: timestamp,
        sign: md5Str,
        code: code
      }
      this.$http.post('/wx_login.php', qs.stringify(postData))
      .then((response) => {
        console.log(response)
      }, (response) => {
        // error callback
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>
@import '/static/style/login.css';
</style>
