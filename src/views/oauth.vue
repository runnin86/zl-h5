<template>
  <div>
  </div>
</template>

<script>
import * as config from './../config'

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
    if (!this.userInfo && this.is_weixn()) {
      // 模板编译之后，代替了之前的ready*
      let code = this.$route.query.code
      if (code) {
        /*
         * 1.微信鉴权后获取code去登录
         */
      } else if (window.localStorage.getItem('zlUser')) {
        /*
         * 2.已登录
         */
        // this.RECORD_USERINFO(this.userInfo)
        this.$router.push({path: 'category'})
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
    } else {
      // 未登录或者非微信浏览器则默认跳转至列表页
      this.$router.push({path: 'category'})
    }
  },
  methods: {
    /**
     * 判断微信浏览器
     */
    is_weixn() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf('micromessenger') !== -1) {
        return true
      } else {
        return false
      }
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
