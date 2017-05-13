<template>
  <div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as config from './../config'

export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  beforeMount () {
    // 模板编译之前
    if (!this.userInfo) {
      /*
       * 微信鉴权
       * 051G0HDC1guKk00QzKDC1xlHDC1G0HDR
       */
      let appid = config.appId
      let redirect_uri = encodeURIComponent(window.location.href) + 'welcome'
      // 应用授权作用域
      //   1:snsapi_base(不弹出授权页面,直接跳转,只能获取用户openid)
      //   2:snsapi_userinfo(弹出授权页面,可通过openid拿到昵称、性别、所在地。
      //    并且,即使在未关注的情况下,只要用户授权，也能获取其信息）
      let scopeType = 'snsapi_userinfo'
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
    } else {
      this.$router.push('index')
    }
  },
  mounted () {
    // 模板编译之后，代替了之前的ready*
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
