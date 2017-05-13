<template>
  <div class="container container-content">

    <div class="row index-title">
      <div class="col-xs-12">
        <div class="shop-name" v-if="storeinfo">{{alias}}</div>
        <div class="shop-name_unshop" v-else>南华汇商城</div>
        <div class="shop-detail clearfix" v-if="storeinfo">
          <div class="user-img">
            <a href="javascript:void(0)">
              <img :src="imgBase64" :style="{backgroundImage: 'url(' + (storeinfo.avatar ? storeinfo.avatar : 'static/images/store/user_pa.jpg') + ')'}">
            </a>
          </div>
          <div class="shop-info">
            <span class="info">个性签名({{storeinfo.signature}})</span>
            <span class="info">店主客服电话：{{storeinfo.mobile}}</span>
            <router-link to="/searchGoods" class="search-icon">
              <span class="iconfont-yzg icon-yzg-sousuo-sousuo"></span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="row navbar-location" style="background:#fff">
      <div class="navbar-yzg-default" :class="storeinfo ? 'index-navbar_box' : null" :style="{width: (parent_cat.length+1)*108+'px'}">
        <ul id='activeMenu' style="width:100%;overflow:hidden;transition:none;touch-action:pan-y;">
          <li v-for="cat in parent_cat" style="width:108px;float: left; display: inline;">
            <router-link :to="{ name: 'Category',path: '/category', params: { cid: cat.cat_id }}">{{cat.cat_name}}</router-link>
          </li>
          <li v-if="this.is_shopkeeper" style="width:108px;float: left; display: inline;">
            <a href="#">店铺推荐</a>
          </li>
        </ul>
      </div>
    </div>
    <!--轮播图-->
    <div class="row slider-box">
      <div :class="storeinfo ? 'slider-content' : 'slider-content_unshop'">
        <wv-swipe class="demo-swipe" :height='280' :auto="4000">
          <wv-swipe-item class="demo-swipe-item"  v-for="bn in turnsInfo" :key="bn.banner">
            <router-link :to="bn.turns_link">
              <img :src="img_domain + bn.banner">
            </router-link>
          </wv-swipe-item>
        </wv-swipe>
      </div>
    </div>
    <!--tel-->
    <div class="row tel_phone">
      <div class="col-xs-6">
        <span class="sqzx">售前咨询:</span>
        <a href="tel:055163458808">055163458808</a>
      </div>
      <div class="col-xs-6">
        <span class="shfw">售后服务:</span>
        <a href="tel:4009696855">4009696855</a>
      </div>
    </div>
    <!--今日特卖-->
    <div class="row">
      <div class="hot-sale_box">
        <div class="hot-sale_title">今日特卖 · 每日上新</div>
        <a href="javascript:void(0)" class="hot-sale_goods" v-for="t in active" @click="linkChange(t.act_range_ext)">
          <div class="hot-sale_img">
            <img :src="imgBase64" :style="{backgroundImage: 'url(' + (img_domain+t.banner) + ')'}">
          </div>
          <div class="hot-sale_info">
            <div class="goods_info">
              <div class="goods_title">
                <span class="discount">{{t.act_price}}</span>
                {{t.act_brief}}
              </div>
              <div class="goods_detail">
                {{t.act_name}}
              </div>
            </div>
            <div class="buy_info">
              <div class="discount_price">{{t.act_price_favourable}}</div>
              <div class="origin_price">{{t.act_price_original}}</div>
              <div class="buy_btn">抢</div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <!--营养保健-->
    <div class="row recommend-goods">
      <a class="goods-banner_pic" href="">
        <img src="static/images/nutrition.jpg">
      </a>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in nutrition" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.goods_id}}">
          <div class="goods-img">
            <img :src="imgBase64" :style="{backgroundImage: 'url(' + (g.goods_img?img_domain+g.goods_img:'/static/images/no_picture.jpg') + ')'}">
          </div>
          <div class="goods-brief">{{g.goods_brief}}</div>
          <div class="goods-title">{{g.goods_name}}</div>
          <div class="goods-price">
            {{g.shop_price}}
            <span class="goods-price_origin">{{g.market_price}}</span>
          </div>
        </router-link>
        <router-link to="/category" class="sub-goods_list">
          <div class="goods-more_list">
            <img src="static/images/lettle_bg.png">
            <p class="see_more">
              <span>查看更多</span>
              <br>
              <span class="eng_more">See More</span>
            </p>
            <div class="space"></div>
          </div>
        </router-link>
      </div>
    </div>
    <!--品质生活quality life-->
    <div class="row recommend-goods">
      <a class="goods-banner_pic" href="">
        <img src="static/images/quality_life.jpg">
      </a>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in qualityLife" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.goods_id}}">
          <div class="goods-img">
            <img :src="imgBase64" :style="{backgroundImage: 'url(' + (g.goods_img?img_domain+g.goods_img:'/static/images/no_picture.jpg') + ')'}">
          </div>
          <div class="goods-brief">{{g.goods_brief}}</div>
          <div class="goods-title">{{g.goods_name}}</div>
          <div class="goods-price">
            {{g.shop_price}}
            <span class="goods-price_origin">{{g.market_price}}</span>
          </div>
        </router-link>
        <router-link to="/category" class="sub-goods_list">
          <div class="goods-more_list">
            <img src="static/images/lettle_bg.png">
            <p class="see_more">
              <span>查看更多</span>
              <br>
              <span class="eng_more">See More</span>
            </p>
            <div class="space"></div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import $ from 'zepto'
import touchslider from 'touchslider'

export default {
  data () {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      parent_cat: [],
      goods_list: [],
      active: [],
      add_new_list: [],
      nutrition: [],
      qualityLife: [],
      turnsInfo: [],
      img_domain: '',
      is_shopkeeper: 1,
      storeinfo: [],
      alias: ''
    }
  },
  init () {
    // console.log('初始化')
  },
  created () {
    // console.log('创建')
  },
  mounted () {
    // 模板编译之后，代替了之前的ready*
  },
  updated () {
    // 组件更新完毕
    touchslider('activeMenu', {
      // duration: 800, // 页面过渡时间
      // interval: 3000, // 幻灯播放时间间隔
      direction: 0, // 页面切换方向，0横向，1纵向
      autoplay: false, // 是否自动播放幻灯
      align: 'left', // 对齐方式，left(top) center(middle) right(bottom
      mousewheel: false, // 是否启用鼠标滚轮切换
      mouse: true, // 是否启用鼠标拖拽
      fullsize: false // 是否全屏幻灯（false为自由尺寸幻灯）
    })
  },
  activated () {
    // 获取数据
    this.$http.get('store_index.php')
    .then(({data: {data, errcode, msg}}) => {
      if (errcode === 0) {
        this.goods_list = data.goods_list
        this.active = data.active
        this.add_new_list = data.add_new_list
        this.nutrition = data.yinyang
        this.qualityLife = data.shenghuo
        this.turnsInfo = data.turns_info
        this.img_domain = data.img_domain
        this.storeinfo = data.storeinfo
        this.alias = data.alias
        // console.log(data)
      } else {
        $.toast(msg, 'forbidden')
        console.warn(errcode, msg, data)
      }
    }, (response) => {
      // error callback
      console.log(response)
    })
    this.$http.get('get_category.php')
    .then(({data: {data, errcode, msg}}) => {
      if (errcode === 0) {
        this.parent_cat = data.parent_cat
        // console.log(data)
      } else {
        $.toast(msg, 'forbidden')
        console.warn(errcode, msg, data)
      }
    }, (response) => {
      // error callback
      console.log(response)
    })
  },
  methods: {
    linkChange (len) {
      if (len.split(',').length === 1) {
        this.$router.push({name: 'Goods', path: '/shopping/goods', query: {gid: len}})
      }
      if (len.split(',').length > 1) {
        this.$router.push({name: 'PanicBuy', path: 'index/panicBuy', query: {id: this.active[len.split(',').length - 1].act_id}})
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.slider-content img{
  width:100%;
}
/*逛逛图标*/
.stroll-box{
  padding-top: 10px;
}
.stroll-box .stroll-banner_img{
  display: block;
}
.stroll-box .stroll-banner_img img{
  width:100%;
}
/*每日早8点*/
.eight-morning img{
  width:100%;
}
.eight-morning{
  margin-top:10px;
}
/*影响其他导航条*/
.navbar-yzg-default ul li a:hover:before,.navbar-yzg-default .active a:before{
  content:"";
  position: absolute;
  width:100%;
  height:2px;
  bottom:-6px;
  background:#d6244f;
}
/*end*/
/*咨询电话*/
.tel_phone{
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 12px;
  background-color: #ef0021;
  color: #fff;
}
.tel_phone .col-xs-6{
  padding:0;
}
.tel_phone a {
  color: #fff;
}
.sqzx {
  color: #f7cf3a;
  background: url(/static/images/jt_sq.png) no-repeat left center;
  background-size: 16px;
  padding-left: 18px;
}
.shfw {
  color: #f7cf3a;
  background: url(/static/images/jt_sh.png) no-repeat left center;
  background-size: 16px;
  padding-left: 18px;
}
.slider-content_unshop{
  padding-top:88px;
}
.shop-name_unshop{
  height:44px;
  line-height:44px;
  text-align: center;
}
</style>
