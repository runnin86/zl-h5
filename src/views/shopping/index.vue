<template>
<div>
  <!-- 头部导航栏 -->
  <div class="row index-title">
    <div class="shop-name">
      <a class="contact_img clearfix" href="tel:0312-7333023">
        <img src="/static/images/lxkf_top.png"/>
        <p>客服</p>
      </a>
      <a class="contact_img clearfix" href="tel:0312-7333023" style="left:2.3rem">
        <img src="/static/images/lxdz_top.png"/>
        <p>店主</p>
      </a>
      <div class="user-img">
        <img :src="imgBase64" style="backgroundImage: url('/static/images/store/user_pa.jpg')">
      </div>
      <router-link to="/searchGoods" class="search-icon">
        <img src="/static/images/search_top.png" />
        <p>搜索</p>
      </router-link>
    </div>
    <div class="shop-detail clearfix">
      <div class="shop-info">
        <span class="nhh-store_name">店铺名称</span>
        <span class="info">终于等到了主人的莅临~</span>
      </div>
    </div>
  </div>
  <!-- 滑动菜单 -->
  <div class="row navbar-location" v-show="sortMenu.length>0">
    <div class="navbar-yzg-default">
      <wv-scroll-menu ref="menuComp" :sortMenu="sortMenu" :sortName="sortName" :fnName="'changeCid'" :activeId="-1"></wv-scroll-menu>
    </div>
  </div>
  <!--轮播图-->
  <div class="row slider-box" style="padding-bottom: 0.2167rem">
    <wv-swipe class="demo-swipe bannerImg" :auto="4000">
      <wv-swipe-item class="demo-swipe-item" v-for="bn in turnsInfo" :key="bn.banner">
        <router-link :to="bn.turns_link">
          <img :src="img_domain + bn.banner">
        </router-link>
      </wv-swipe-item>
    </wv-swipe>
  </div>
  <!--通知栏-->
  <div class="row notice-box">
    <div class="notice">
      <img class="notice_img" src="/static/images/notice.png" />
      <span>
        <i>通知</i>
      </span>
    </div>
    <wv-scroll-notice :content="content_text" :scrollamount="scrollamount" :direction="direction">
    </wv-scroll-notice>
    <div class="arrows">
      <img class="arrows_img" src="/static/images/arrows.png" />
    </div>
  </div>
  <!--早8点-->
  <div class="row eight-morning" v-if="add_new_list.length !== 0">
    <img :src="img_domain + banner">
    <div class="goods-lists clearfix">
      <div class="sub-goods_list" v-for="n in add_new_list">
        <router-link :to="{name: 'Goods', path: '/shopping/goods', query: {gid: n.upc_id}} " class="list-link">
          <div class="goods-img">
            <img :src="n.img_url ? n.img_url : '/static/images/no_picture.jpg'">
          </div>
          <div class="goods-price">
            {{n.shop_price}}
            <span class="goods-price_origin">{{n.market_price}}</span>
          </div>
          <div class="goods-brief">{{n.goods_brief}}</div>
          <div class="goods-title">{{n.goods_name}}</div>
        </router-link>
      </div>
    </div>
  </div>
  <!-- 楼层专场 -->
  <wv-floor-goods :composeFloorArr="composeFloorArr" @redirectTo="redirectTo"></wv-floor-goods>
  <!--分享二维码-->
  <div class="shareQ" @click="freshQRCodeShow" style="display:none;">
    <img style="width:3.0769rem" src="/static/images/fenxiang.png" />
  </div>
  <div class="shopShare" v-show="qrShareShow">
    <div class="shopShareBg" @click="qrShareShow=!qrShareShow"></div>
    <div class="shopShareCont">
      <wv-compose-image ref="composeImage" :width="640" :height="900"
        :imageArr="shopImgs" :textArr="shopText"
        :qrLeft="250" :qrTop="380" :qrSize="122"
        bgColor="#f9f9fc" :qrValue="qrShareValue">
      </wv-compose-image>
    </div>
  </div>
</div>
</template>

<script type="text/babel">
import $ from 'zepto'
import * as data from './../../data'

export default {
  data() {
    return {
      direction: 'up',
      scrollamount: 1,
      content_text: '为了商城能带给您更好的服务，于8月10日晚间9：30分至次日早间8：00商城进行系统升级，可能会对您的购物浏览造成不便，敬请谅解!',
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      goods_list: [],
      active: [],
      add_new_list: [],
      turnsInfo: [],
      img_domain: '',
      banner: '',
      is_shopkeeper: 1,
      storeinfo: null,
      store_detail: null,
      loadComplete: false,
      sortMenu: data.menuList,
      sortName: data.menuList,
      qrShareShow: false,
      qrShareValue: '',
      shopImgs: [],
      shopText: [],
      composeFloorArr: []
    }
  },
  mounted() {
    // 模板编译之后，代替了之前的ready*
  },
  activated() {
    this.sortMenu = [{id: -1, name: '首页'}]
    this.sortName = [{id: 0, name: '全部商品'}]
    for (let m of data.menuList) {
      // 组装菜单
      this.sortMenu.push({
        id: m.id,
        name: m.name
      })
      this.sortName.push({
        id: m.id,
        name: m.name
      })
    }
    // 滑动菜单不展开
    this.$refs.menuComp.subitemsExpanded = false
    this.$on('changeCid', function(id) {
      // 接受组件通知方法
      if (id !== -1) { // 当点击的id不是-1（首页），跳转到相应分类列表
        this.$router.push({
          name: 'Category',
          path: '/category',
          params: {cid: id}
        })
      }
    })
    // this.loadData()
    let _this = this
    $(document).ready(function() {
      $('.navbar-location').css({
        'position': 'relative',
        'width': 'auto'
      })
      $(window).scroll(function() {
        // 滑动菜单不展开
        _this.$refs.menuComp.subitemsExpanded = false
        let scrollT = $(window).scrollTop()
        if (scrollT < 44) {
          $('.navbar-location').css({
            'position': 'relative',
            'width': 'auto'
          })
        } else {
          $('.navbar-location').css({
            'position': 'fixed',
            'width': '100%'
          })
        }
      })
    })
    setTimeout(() => {
      // 合成图片参数的赋值
      this.shopImgs = [{
        src: 'static/images/share/shop-bg.png',
        width: 640,
        height: 831,
        x: 0,
        y: 0,
        isCircular: false
      }, {
        src: window.localStorage.getItem('store_avatar_nhh'),
        width: 100,
        height: 100,
        x: 260,
        y: 120,
        isCircular: true
      }, {
        src: 'static/images/share/shop-qr-bg.png',
        width: 164,
        height: 197,
        x: 230,
        y: 360,
        isCircular: false
      }, {
        src: 'static/images/share/shop-block.png',
        width: 379,
        height: 58,
        x: 130,
        y: 629,
        isCircular: false
      }]
      this.shopText = [{
        font: 'bold 32px PingFang SC',
        style: '#FFF',
        align: 'center',
        text: window.localStorage.getItem('store_name_nhh') ? window.localStorage.getItem('store_name_nhh') : '南华汇',
        x: 310,
        y: 276,
        h: 32
      }, {
        font: '20px PingFang SC',
        style: '#FFF',
        align: 'left',
        text: '为你过的更好，就是我存在的理由！',
        x: 158,
        y: 320,
        h: 32
      }, {
        font: 'bold 32px PingFang SC',
        style: '#000000',
        align: 'left',
        text: '爆 款 特 卖',
        x: 228,
        y: 670,
        h: 32
      }, {
        font: '24px PingFang SC',
        style: '#666666',
        align: 'center',
        text: '环球购物商城盛大开业，',
        x: 332,
        y: 770,
        h: 32
      }, {
        font: '24px PingFang SC',
        style: '#666666',
        align: 'center',
        text: '每日推送多款爆品特卖,全场商品均五折起售',
        x: 332,
        y: 806,
        h: 32
      }, {
        font: '24px PingFang SC',
        style: '#666666',
        align: 'center',
        text: '还有更多意想不到的惊喜在等您',
        x: 332,
        y: 840,
        h: 32
      }]
      // 自带分享相关
      let sid = window.localStorage.getItem('seller_id_nhh')
      let storeName = window.localStorage.getItem('store_name_nhh') ? window.localStorage.getItem('store_name_nhh') : '南华汇商城'
      // 分享图片地址
      let imgUrl = this.$parent.getShareImg()
      // 分享出去的链接
      let link = window.location.href
      if (link.indexOf('seller_id=') === -1) {
        link += sid ? '?seller_id=' + sid : ''
      }
      // 刷新分享二维码
      this.qrShareValue = link
      // this.freshQRCode(link, imgUrl)
      // 微信分享初始化->(title, desc, imgUrl, link)
      let desc = this.$weChatShareDesc()
      this.initWechatShare(
        storeName + '首页',
        desc,
        imgUrl,
        link)
    }, 300)
  },
  methods: {
    loadData() {
      // 获取数据
      this.$http.get('store_index.php').then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.goods_list = data.goods_list
          this.active = data.active
          this.add_new_list = data.add_new_list
          this.turnsInfo = data.turns_info
          this.img_domain = data.img_domain
          this.banner = data.banner
          this.storeinfo = data.storeinfo
          this.store_detail = data.store_detail
          this.loadComplete = true
          // 组合各个楼层数据
          this.composeFloor(data.hufu, data.getixihu, data.yinyang, data.shipin, data.meizhuang, data.shenghuo, data.muyin)
        } else {
          $.toast(msg, 'forbidden')
          console.warn(errcode, msg, data)
          console.log(data)
        }
      }, (response) => {
        // error callback
        console.log(response)
      })
    },
    // 刷新二维码 重新绘制图像
    freshQRCodeShow() {
      // 刷新数据
      this.shopText[0].text = window.localStorage.getItem('store_name_nhh') ? window.localStorage.getItem('store_name_nhh') : '南华汇'
      this.shopImgs[1].src = window.localStorage.getItem('store_avatar_nhh')
      // 重新绘制图像
      this.$refs.composeImage.draw()
      this.qrShareShow = true
    },
    /**
     * [composeFloor 组合每个楼层的数据,数据由store_index.php接口获得]
     */
    composeFloor(hufu, getixihu, yinyang, shipin, meizhuang, shenghuo, muyin) {
      this.floorAddEle(hufu, '/static/images/floorBanner/skin_care.jpg', '护肤专场')
      this.floorAddEle(getixihu, '/static/images/floorBanner/individual_care.jpg', '个人护理')
      this.floorAddEle(yinyang, '/static/images/floorBanner/nutrition.jpg', '营养保健')
      this.floorAddEle(shipin, '/static/images/floorBanner/food.jpg', '进口食品')
      this.floorAddEle(meizhuang, '/static/images/floorBanner/beauty.jpg', '美妆专场')
      this.floorAddEle(shenghuo, '/static/images/floorBanner/quality_life.jpg', '品质生活')
      this.floorAddEle(muyin, '/static/images/floorBanner/child_care.jpg', '母婴专场')
    },
    /**
     * [floorAddEle 组合每个楼层数据并添加banner和title]
     * @param  {[type]} objArr [添加数组来源]
     * @param  {[type]} banner
     * @param  {[type]} title  [楼层标题]
     */
    floorAddEle(objArr, banner, title) {
      objArr['banner'] = banner
      objArr['title'] = title
      this.composeFloorArr.push(objArr)
    },
    /**
     * [redirectTo 页面跳转]
     * @param  {[type]} type [确定跳转页面是列表还是详情]
     * @param  {[type]} id   [携带参数id 列表页是cid, 详情是gid]
     */
    redirectTo(type, id) {
      if (type === 'category') {
        this.$router.push({
          name: 'Category',
          path: '/category',
          params: {
            cid: id
          }
        })
      } else {
        this.$router.push({
          path: 'shopping/goods',
          query: {
            gid: id
          }
        })
      }
    }
  },
  watch: {}
}
</script>

<style scoped>
/*轮播图*/
.demo-swipe-item img {
  width: 100%;
}

.arrows {
  width: 3rem;
  height: 1.28rem;
  text-align: center;
}

.arrows_img {
  width: 0.512rem;
  height: 0.512rem;
  display: inline-block;
  vertical-align: -webkit-baseline-middle;
}

/*影响其他导航条*/
.navbar-yzg-default ul li a:hover:before,
.navbar-yzg-default .active a:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -11px;
  background: #ed3366;
}

.navbar-yzg-default ul li a:hover {
  color: #353a40;
  font-weight: bold;
}

.navbar-location {
  background: #f6f6f6;
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
  z-index: 502;
}

.auction {
  margin-top: 0.2167rem;
}

.auction .auctionImg {
  position: relative;
  display: block;
  background-color: #fff;
}

.auctionImg>img {
  width: 100%;
  vertical-align: bottom;
}

.auctionImg .countUpNumber {
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 100%;
}

.auctionImg .countUpNumber i {
  display: inline-block;
  background: url(/static/images/numberBg.png);
  width: 17px;
  height: 17px;
  background-size: 100%;
  text-align: center;
  line-height: 17px;
  font-style: normal;
  margin-right: 5px;
}

.auctionImg .countUpNumber i:last-child {
  margin-right: 0;
}

.auction .auctionContent {
  padding: 5px 0 5px 5px;
  background-color: #fff;
}

.auctionContent .goods {
  padding-left: 0;
  padding-right: 5px;
}

.goods .goodsImg {
  position: relative;
}

.goods .goodsImg img {
  width: 100%;
  height: 120px;
  vertical-align: bottom;
}

.goodsImg .goodsCountUpNumber {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  color: #fff;
  font-size: 12px;
}

.goodsImg .goodsCountUpNumber.unstartBg {
  background-color: #5B7952;
}

.goodsImg .goodsCountUpNumber.doingBg {
  background-color: #E86A6A;
}

.goodsImg .goodsCountUpNumber.doneBg {
  background-color: #3D3D3D;
}

.goodsInfo .title {
  height: 34px;
  line-height: 17px;
  overflow: hidden;
}

.goodsInfo .number {
  margin-top: -3px;
}
</style>
