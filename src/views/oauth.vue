<template>
  <div>
  </div>
</template>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'
import * as config from './../config'
import util from './../utils'

let loading
export default {
  data() {
    return {
    }
  },
  beforeCreate() {
    // 组件实例刚刚被创建，属性都没有
  },
  created() {
    // 组件实例创建完毕，属性已经绑定
  },
  beforeMount() {
    // 模板编译之前
  },
  mounted() {
  },
  activated() {
    // 激活方法
    this.$store.commit('CHANGE_IS_INDEX', false)
    /*
     * 微信授权
     */
    this.doWeChatAuth()
  },
  methods: {
    /*
     * 微信授权验证
     */
    doWeChatAuth() {
      console.log('开始微信授权')
      // 逻辑处理
      if (this.$route.query.code) {
        // 业务登录
        this.doLogin(this.$route.query.code)
      } else {
        // 发起授权
        this.wechatRedirect()
      }
    },
    /*
     * 微信授权跳转
     */
    wechatRedirect() {
      let innerParam = ''
      let appid = config.appId
      // let redirect_uri = config.redirectUri
      let redirect_uri = encodeURIComponent(location.origin)
      // 应用授权作用域
      //   1:snsapi_base(不弹出授权页面,直接跳转,只能获取用户openid)
      //   2:snsapi_userinfo(弹出授权页面,可通过openid拿到昵称、性别、所在地。
      //    并且,即使在未关注的情况下,只要用户授权，也能获取其信息）
      let scopeType = 'snsapi_userinfo'
      // 组装鉴权URL
      let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
      'appid=' + appid +
      '&redirect_uri=' + redirect_uri +
      '&response_type=code' +
      '&scope=' + scopeType +
      '&state=' + innerParam +
      '#wechat_redirect'
      console.log(oauthUrl)
      location.href = oauthUrl
    },
    /*
     * 根据授权得到的code去登录
     */
    doLogin(code) {
      console.log('发起业务登录', code, util.getStore('url_hash_zl'))
      // 微信授权回调后获得code去调用登录接口
      let loginParam = {
        code: code
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

            // 定义
            let hash = util.getStore('url_hash_zl')
            let path = hash || '#/category'
            // 跳转前删除hash
            util.removeStore('url_hash_zl')
            // 最终跳转
            let base = this.$router.options.base ? this.$router.options.base : ''
            console.log('最终跳转', location.origin + base + '/?' + path)
            location.href = location.origin + base + '/?' + path
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
  },
  beforeUpdate() {
    // 组件更新之前
  },
  updated() {
    // 组件更新完毕
  },
  beforeDestroy() {
    // 组件销毁之前
  },
  destroyed() {
    // 组件销毁后
  }
}
</script>
