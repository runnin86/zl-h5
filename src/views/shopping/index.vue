<template>
  <div>
  <!-- 头部导航栏 -->
    <div class="row index-title">
      <!-- <div class="col-xs-2">
        <div class="user-img" v-if="storeinfo">
          <img :src="imgBase64" :style="{backgroundImage: 'url(' + (storeinfo.avatar ? storeinfo.avatar : 'static/images/store/user_pa.jpg') + ')'}">
        </div>
      </div>
      <div class="col-xs-8 shop-name">
        <span v-if="storeinfo">{{store_detail.store_name}}</span>
        <span v-else>南华汇商城</span>
      </div>
      <div class="col-xs-2">
        <router-link to="/searchGoods" class="search-icon">
          <span class="iconfont-yzg icon-yzg-sousuo-sousuo"></span>
        </router-link>
      </div> -->
      <div class="shop-name" v-if="storeinfo">
        <div class="user-img">
          <img :src="imgBase64" :style="{backgroundImage: 'url(' + (storeinfo.avatar ? storeinfo.avatar : 'static/images/store/user_pa.jpg') + ')'}">
        </div>
        <span class="nhh-store_name">{{store_detail.store_name}}</span>
      </div>
      <div class="unshop-name" v-else>南华汇商城</div>
      <div class="shop-detail clearfix" v-if="storeinfo">
        <!-- <div class="user-img">
          <img :src="imgBase64" :style="{backgroundImage: 'url(' + (storeinfo.avatar ? storeinfo.avatar : 'static/images/store/user_pa.jpg') + ')'}">
        </div> -->
        <div class="shop-info">
          <span class="info">个性签名({{storeinfo.signature}})</span>
          <span class="info">店主客服电话：{{storeinfo.mobile}}</span>
          <router-link to="/searchGoods" class="search-icon" style="color:#fff">
            <span class="iconfont-yzg icon-yzg-sousuo-sousuo"></span>
          </router-link>
        </div>
      </div>
    </div>
    <!--导航条-->
    <div class="row navbar-location">
      <div class="navbar-yzg-default" :style="{width: (parent_cat.length+1)*108+'px'}">
        <ul id='activeMenu' style="width:100%;overflow:hidden;transition:none;touch-action:pan-y;">
          <li class="active" style="width:108px;float: left; display: inline;">首页</li>
          <li v-for="cat in parent_cat" style="width:108px;float: left; display: inline;">
            <router-link :to="{ name: 'Category',path: '/category', params: {cid: cat.cat_id}}">
              {{cat.cat_name}}
            </router-link>
          </li>
          <!-- <li v-if="this.is_shopkeeper" style="width:108px;float: left; display: inline;">
            <a href="#">店铺推荐</a>
          </li> -->
        </ul>
      </div>
    </div>
    <!--轮播图-->
    <div class="row slider-box">
      <wv-swipe class="demo-swipe" :height='280' :auto="4000">
        <wv-swipe-item class="demo-swipe-item"  v-for="bn in turnsInfo" :key="bn.banner">
          <router-link :to="bn.turns_link">
            <img :src="img_domain + bn.banner">
          </router-link>
        </wv-swipe-item>
      </wv-swipe>
    </div>
    <!--tel-->
    <!-- <div class="row tel_phone" v-if="storeinfo">
      <div class="col-xs-12">
        <a :href="'tel:' + storeinfo.mobile">
          <span class="iconfont-yzg icon-yzg-dianhua icon-dianhua-color"></span>
          <span class="shoper">店主客服电话:</span>
          <span class="shoper_phone">{{storeinfo.mobile}}</span>
        </a>
      </div>
    </div> -->
    <!--早8点-->
    <div class="row eight-morning">
      <div class="goods-banner">
        <img :src="img_domain + banner"/>
      </div>
      <div class="goods-lists clearfix">
        <div class="sub-goods_list" v-for="n in add_new_list">
          <router-link :to="{name: 'Goods', path: '/shopping/goods', query: {gid: n.upc_id}} " class="list-link">
            <div class="goods-img">
              <img :src="imgBase64" :style="{backgroundImage: 'url(' + (n.master_img ? img_domain + n.master_img : '/static/images/no_picture.jpg') + ')'}">
            </div>
            <div class="goods-brief">{{n.goods_brief}}</div>
            <div class="goods-title">{{n.goods_name}}</div>
            <div class="goods-price">
              {{n.shop_price}}
              <span class="goods-price_origin">{{n.market_price}}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <!--今日特卖-->
    <div class="row">
      <div class="hot-sale_box">
        <div class="hot-sale_title">今日特卖 · 每日上新</div>
        <a href="javascript:void(0)" class="hot-sale_goods" v-for="t in active" @click="linkChange(t.act_range_ext, t.act_id)">
          <div class="hot-sale_img">
            <img :src="img_domain + t.banner">
          </div>
          <div class="hot-sale_info">
            <div class="goods_info">
              <!-- <div class="goods_title">
                <span class="discount">{{t.act_price}}</span>
                {{t.act_brief}}
              </div> -->
              <div class="goods_detail">
                {{t.act_name}}
              </div>
            </div>
            <div class="buy_info">
              <!-- <div class="discount_price">{{t.act_price_favourable}}</div>
              <div class="origin_price">{{t.act_price_original}}</div> -->
              <div class="buy_btn">抢</div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <!-- 美妆 beauty-->
    <div class="row recommend-goods">
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '43'}}">
        <img src="static/images/floorBanner/beauty.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in beauty" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '43'}}" class="sub-goods_list">
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
    <!-- 护肤 skin care -->
    <div class="row recommend-goods">
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '46'}}">
        <img src="static/images/floorBanner/skin_care.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in skinCare" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '46'}}" class="sub-goods_list">
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
    <!-- 个体洗护 Individual care -->
    <div class="row recommend-goods">
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '100'}}">
        <img src="static/images/floorBanner/individual_care.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in individualCare" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '100'}}" class="sub-goods_list">
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
    <!--营养保健-->
    <div class="row recommend-goods">
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '112'}}">
        <img src="static/images/floorBanner/nutrition.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in nutrition" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '112'}}" class="sub-goods_list">
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
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '49'}}">
        <img src="static/images/floorBanner/quality_life.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in qualityLife" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '49'}}" class="sub-goods_list">
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
    <!-- 食品 food -->
    <div class="row recommend-goods">
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '70'}}">
        <img src="static/images/floorBanner/food.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in food" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '70'}}" class="sub-goods_list">
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
    <!-- 母婴 child care -->
    <div class="row recommend-goods">
      <router-link class="goods-banner_pic" :to="{name: 'Category', path: '/category', params: {cid: '61'}}">
        <img src="static/images/floorBanner/child_care.jpg">
      </router-link>
      <div class="goods-lists clearfix">
        <router-link class="sub-goods_list" v-for="g in childCare" :key="g.goods_id" :to="{name: 'Goods', path: '/shopping/goods', query: {gid: g.upc_id}}">
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
        <router-link :to="{name: 'Category', path: '/category', params: {cid: '61'}}" class="sub-goods_list">
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
import touchslider from 'static/js/touchslider.js'

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
      individualCare: [],
      skinCare: [],
      beauty: [],
      food: [],
      childCare: [],
      turnsInfo: [],
      img_domain: '',
      banner: '',
      is_shopkeeper: 1,
      storeinfo: null,
      store_detail: null
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
    // 微信分享初始化->(title, desc, imgUrl, link)
    let desc = '【南华汇】帅哥美女们，我当老板啦！快来我的小店逛逛，捧个场吧！不知道我当老板了？再不来【南华汇】逛逛，你就out了！'
    this.$parent.initWechatShare(
      '南华汇商城首页',
      desc,
      'imgUrl',
      window.location.href)
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
    this.loadData()
    $(document).ready(function () {
      $('.navbar-location').css({'position': 'relative', 'width': 'auto'})
      $('.container').scroll(function () {
        let scrollT = $('.container').scrollTop()
        if (scrollT < 44) {
          $('.navbar-location').css({'position': 'relative', 'width': 'auto'})
        } else {
          $('.navbar-location').css({'position': 'fixed', 'width': '100%'})
        }
      })
    })
  },
  methods: {
    linkChange (len, act_id) {
      if (len.split(',').length === 1) {
        // this.$router.push({name: 'Goods', path: '/shopping/goods', query: {gid: len}})
        this.$http.get('favourable_goods.php', {
          params: {
            id: act_id
          }
        })
        .then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            console.log(data.goods_list[0].upc_id)
            this.$router.push({name: 'Goods', path: '/shopping/goods', query: {gid: data.goods_list[0].upc_id}})
          } else {
            console.error('获取商品列表失败:' + msg)
          }
        }, (response) => {
          // error callback
          console.log(response)
        })
      }
      if (len.split(',').length > 1) {
        this.$router.push({name: 'PanicBuy', path: 'index/panicBuy', query: {id: this.active[len.split(',').length - 1].act_id}})
      }
    },
    loadData () {
      // 获取数据
      this.$http.get('store_index.php')
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.goods_list = data.goods_list
          this.active = data.active
          this.add_new_list = data.add_new_list
          this.nutrition = data.yinyang
          this.qualityLife = data.shenghuo
          this.skinCare = data.hufu
          this.individualCare = data.getixihu
          this.beauty = data.meizhuang
          this.food = data.shipin
          this.childCare = data.muyin
          this.turnsInfo = data.turns_info
          this.img_domain = data.img_domain
          this.banner = data.banner
          this.storeinfo = data.storeinfo
          this.store_detail = data.store_detail
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
    }
  },
  watch: {
  }
}
</script>

<style scoped>
/*轮播图*/

.demo-swipe-item img{
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
  -webkit-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
  bottom:-11px;
  background:#ed3366;
}
/*end*/
/*咨询电话*/
.tel_phone{
  height: 38px;
  line-height: 38px;
  text-align: center;
  background-color: #ed3366;
  color: #fff;
}
/*.sqzx {
  color: #f7cf3a;
  background: url(/static/images/jt_sq.png) no-repeat left center;
  background-size: 16px;
  padding-left: 18px;
  font-size:13px;
}*/
.tel_phone .shoper {
  color: #eee;
  font-size:13px;
}
.tel_phone .shoper_phone {
  color: #fff;
  font-size:13px;
}
.navbar-yzg-default ul li a:hover{
  color:#353a40;
  font-weight: bold;
}
.navbar-location{ background: #f6f6f6 }
.goods-lists .sub-goods_list {
  margin-top:0;
}
.icon-dianhua-color {
  color:#fff;
}
.shop_name .nhh-store_name{
  display: block;
  margin-top: -7px;
}
</style>
