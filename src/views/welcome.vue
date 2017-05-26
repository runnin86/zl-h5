<template>
  <div class="loader">
    <!-- <div class="tips">努力加载中...</div> -->
    <div class="pacman">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
// import qs from 'qs'
// import md5 from 'md5'
// import $ from 'zepto'

export default {
  data() {
    return {
    }
  },
  beforeCreate() {
    // 组件实例刚刚被创建，属性都没有
    // console.log(this.$store.getters.userInfo)
    // if (!this.$store.storeUser) {
    //   // 去鉴权
    //   this.$router.push({path: '/oauth'})
    // }
  },
  created() {
    // 组件实例创建完毕，属性已经绑定
  },
  beforeMount() {
    // 模板编译之前
  },
  mounted() {
    // 模板编译之后，代替了之前的ready*
    // 跳转至列表页
    this.$router.push({path: '/category'})
    // let code = this.$route.query.code
    // if (code) {
    //   console.log('doLogin:' + '' + code)
    //   // // let state = this.$route.query.state
    //   // // 微信授权回调后获得code去调用登录接口
    //   let timestamp = Date.parse(new Date()) / 1000
    //   let md5Str = md5('0' + timestamp + 'NhH$ApI')
    //   let loginParam = {
    //     timestamp: timestamp,
    //     sign: md5Str,
    //     uid: 0,
    //     code: code
    //   }
    //   let zhis = this
    //   this.$http.post('wx_login.php', qs.stringify(loginParam))
    //   .then(function({data: {data, errcode, msg}}) {
    //     if (errcode === 0) {
    //       zhis.$store.commit('SET_USER', data.user)
    //       // 跳转至列表页
    //       zhis.$router.push({path: '/category'})
    //     } else {
    //       $('.pacman').hide()
    //       $.toast(msg, 'forbidden')
    //       console.warn(errcode, msg, data)
    //     }
    //   }).catch(function(error) {
    //     $('.pacman').hide()
    //     $.toast('系统异常', 'forbidden')
    //     console.error(error)
    //   })
    // }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
-webkit-keyframes rotate_pacman_half_up {
  0% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  50% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  100% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
}
@keyframes rotate_pacman_half_up {
  0% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  50% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  100% {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
}
@-webkit-keyframes rotate_pacman_half_down {
  0% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
@keyframes rotate_pacman_half_down {
  0% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
@-webkit-keyframes pacman-balls {
  75% {
    opacity: 0.7;
  }
  100% {
    -webkit-transform: translate(-100px, -6.25px);
    transform: translate(-100px, -6.25px);
  }
}
@keyframes pacman-balls {
  75% {
    opacity: 0.7;
  }
  100% {
    -webkit-transform: translate(-100px, -6.25px);
    transform: translate(-100px, -6.25px);
  }
}
.loader {
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: white;
}
.pacman {
  left: 50%;
  top: 50%;
  margin-top: -2rem;
  margin-left: -1.5rem;
  position: absolute;
}
.pacman > div:nth-child(2) {
  -webkit-animation: pacman-balls 1s -0.99s infinite linear;
  animation: pacman-balls 1s -0.99s infinite linear;
}
.pacman > div:nth-child(3) {
  -webkit-animation: pacman-balls 1s -0.66s infinite linear;
  animation: pacman-balls 1s -0.66s infinite linear;
}
.pacman > div:nth-child(4) {
  -webkit-animation: pacman-balls 1s -0.33s infinite linear;
  animation: pacman-balls 1s -0.33s infinite linear;
}
.pacman > div:nth-child(5) {
  -webkit-animation: pacman-balls 1s 0s infinite linear;
  animation: pacman-balls 1s 0s infinite linear;
}
.pacman > div:first-of-type {
  width: 0px;
  height: 0px;
  border-right: 1.5rem solid transparent;
  border-top: 1.5rem solid rgb(216, 65, 65);
  border-left: 1.5rem solid rgb(216, 65, 65);
  border-bottom: 1.5rem solid rgb(216, 65, 65);
  border-radius: 1.5rem;
  -webkit-animation: rotate_pacman_half_up 0.5s 0s infinite;
  animation: rotate_pacman_half_up 0.5s 0s infinite;
  position: relative;
  left: -1.5rem;
}
.pacman > div:nth-child(2) {
  width: 0;
  height: 0;
  border-right: 1.5rem solid transparent;
  border-top: 1.5rem solid rgb(216, 65, 65);
  border-left: 1.5rem solid rgb(216, 65, 65);
  border-bottom: 1.5rem solid rgb(216, 65, 65);
  border-radius: 1.5rem;
  -webkit-animation: rotate_pacman_half_down 0.5s 0s infinite;
  animation: rotate_pacman_half_down 0.5s 0s infinite;
  margin-top: -3rem;
  position: relative;
  left: -1.5rem;
}
.pacman > div:nth-child(3), .pacman > div:nth-child(4), .pacman > div:nth-child(5), .pacman > div:nth-child(6) {
  background-color: rgb(216, 65, 65);
  /*width: 15px;
  height: 15px;*/
  border-radius: 100%;
  margin: 1rem;
  width: 1rem;
  height: 1rem;
  position: absolute;
  -webkit-transform: translate(0, -6.25px);
  -ms-transform: translate(0, -6.25px);
  transform: translate(0, -6.25px);
  top: .4rem;
  left: 6.2rem;
}
</style>
