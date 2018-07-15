<template>
<div>
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>邀请</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{ path: '/index' }">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <div class="main_share">
    <div class="row">
      <div class="qrCode">
        <wv-qrcode :size="size" :bgColor="bgColor" :fgColor="fgColor"
          :logo="logo" :value="value"></wv-qrcode>
        <p>分享二维码邀请好友加入，快来壮大自己的队伍吧！</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
var mid = JSON.parse(window.localStorage.getItem('zlUser')).mid
export default {
  data() {
    return {
      size: 140,
      bgColor: '#fff',
      fgColor: '#000',
      logo: '', // this.$parent.getShareImg(),
      value: window.location.origin + '/#/userCenter/active?mid=' + mid
    }
  },
  activated() {
    // 微信分享初始化->(title, desc, imgUrl, link)
    let title = '【足力购】欢迎您的加入'
    // 分享图片地址
    let imgUrl = this.$parent.getShareImg()
    let desc = this.$weChatShareDesc()
    // 分享出去的链接
    let link = window.location.origin + '/?#/userCenter/active?mid=' + mid
    console.log(link)
    // 初始化微信默认分享
    this.initWechatShare(
      title,
      desc,
      imgUrl,
      link
    )
  },
  methods: {
  }
}
</script>

<style scoped>
.qrCode {
  text-align: center;
  margin: 60px 0 0;
}

.qrCode p {
  margin: 20px auto 30px;
  width: 60%;
  color: #F05;
}

.main_share {
  padding-top: 44px;
}

.inviting {
  text-align: center;
  padding-bottom: 0.8547rem;
  position: relative;
}

.inviting img {
  position: absolute;
  left: 18%;
  margin: 0 auto;
  top: -0.6rem;
  width: 3.5rem;
  animation: inviteAni 0.3s infinite alternate;
}

.shopShare {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 501;
  text-align: center;
  height: 100%;
}

.shopShare .shopShareBg {
  position: absolute;
  width: 100%;
  background: rgba(0, 0, 0, .5);
  height: 100%;
  z-index: 501
}

.shopShare .shopShareCont {
  position: relative;
  width: 70%;
  left: 0;
  top: 0;
  margin: 0 auto;
  margin-top: 35%;
  z-index: 502
}

@keyframes inviteAni {
  from {
    top: -0.6rem;
  }
  to {
    top: -0.8rem;
  }
}
</style>
