<template>
<div class="container container-content">
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <!-- <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a> -->
    </div>
    <div class="col-xs-8 shop-name">
      <span>{{title_name}}</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <!-- <router-link :to="{ name: 'Index',path: '/index'}">
        <span class="iconfont-yzg icon-yzg-fudaoshangcheng"></span>
      </router-link> -->
    </div>
  </div>
  <div class="row navbar-location" v-show="parent_cat.length>0">
    <div class="navbar-yzg-default navbar-category">
      <ul id='activeMenu' class="ul-slider">
        <li class="slider-item" :class="cid===-1?'active':''">
          <a @click="changeCid(-1)">全部商品</a>
        </li>
        <li v-for="cat in parent_cat" class="slider-item"
          v-if="cat.cat_id>-1" :class="cat.cat_id===cid?'active':''">
          <a @click="changeCid(cat.cat_id)">{{cat.cat_name}}</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row recommend-goods category-goods">
    <div class="goods-lists clearfix"
      v-infinite-scroll="queryList"
      infinite-scroll-immediate-check="false"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="30">
      <a v-for="g in goods_list" class="sub-goods_list">
        <router-link :to="{ name: 'Goods',path: '/shopping/goods', query: { gid: g.upc_id }}">
          <!-- <div class="goods-img progressive">
            <img class="preview"
              v-progressive="g.master_img?img_domain+g.master_img:'/static/images/no_picture.jpg'"
              :data-srcset="g.master_img?img_domain+g.master_img:'/static/images/no_picture.jpg'"
              :src="g.master_img?img_domain+g.master_img:'/static/images/no_picture.jpg'" />
          </div> -->
          <div class="goods-img">
            <img :src="imgBase64"
              :style="{backgroundImage: 'url(' + (g.img?img_domain+g.img:'/static/images/no_picture.jpg') + ')'}">
          </div>
        </router-link>
        <div class="goods-title2" v-html="g.productName"></div>
        <div class="goods-title" v-html="g.productDesc"></div>
        <div class="goods-price">
          ￥{{g.price}}
          <span class="good_price_original">￥{{g.marketPrice}}</span>
        </div>
      </a>
    </div>
  </div>
  <div class="weui-loadmore" v-if="showLoading&&pagenum>-1">
    <i class="weui-loading"></i>
    <span class="weui-loadmore__tips">正在加载</span>
  </div>
  <div class="weui-loadmore weui-loadmore_line" v-if="pagenum===-1">
    <span class="weui-loadmore__tips">暂无商品</span>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import Touchslider from 'touchslider'
// import Vue from 'vue'
// import progressive from './../../directives/progressive-image'
//
// Vue.use(progressive, {
//   removePreview: true,
//   scale: true
// })
let menu

export default {
  data () {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      parent_cat: [{
        cat_id: -1,
        cat_name: '全部商品'
      }, {
        cat_id: 0,
        cat_name: '光伏发电'
      }, {
        cat_id: 1,
        cat_name: '汽车'
      }, {
        cat_id: 2,
        cat_name: '太阳能'
      }, {
        cat_id: 3,
        cat_name: '居家生活'
      }, {
        cat_id: 4,
        cat_name: '特色产品'
      }, {
        cat_id: 5,
        cat_name: '其他'
      }],
      goods_list: [],
      img_domain: 'http://img.zulibuy.com/images/',
      title_name: '全部商品',
      cid: -1,
      pagenum: 0,
      showLoading: false,
      busy: true
    }
  },
  mounted () {
    // 模板编译之后，代替了之前的ready*
    this.$nextTick(function() {
      if (this.$parent.fromPath !== '/shopping/goods' || this.goods_list.length === 0) {
        // 非详情页或数据为空要加载数据
        this.queryList()
      }
    })
  },
  updated () {
    menu = new Touchslider('activeMenu', {
      // duration: 800, // 页面过渡时间
      // interval: 3000, // 幻灯播放时间间隔
      direction: 0, // 页面切换方向，0横向，1纵向
      autoplay: false, // 是否自动播放幻灯
      align: 'left', // 对齐方式，left(top) center(middle) right(bottom
      mousewheel: false, // 是否启用鼠标滚轮切换
      mouse: true, // 是否启用鼠标拖拽
      fullsize: false // 是否全屏幻灯（false为自由尺寸幻灯）
    })
    menu.end = function() {
    }
    // menu.on('dragEnd', function() {
    //   console.log($('#activeMenu').css('left'))
    // })
  },
  /*
   * 激活
   */
  activated () {
    // 当组件在 <keep-alive> 内被切换，
    // 它的 activated(激活) 和 deactivated(解散) 这两个生命周期钩子函数将会被对应执行。
    if (this.$route.params.cid) {
      // this.cid = this.$route.params.cid
      this.changeCid(this.$route.params.cid)
    }
    $('.container').scrollTop(this.$parent.scrollTop)
  },
  methods: {
    /*
     * 分类点击
     */
    changeCid (cid) {
      // this.title_name = this.parent_cat[value = cid]
      this.title_name = this.parent_cat[cid + 1].cat_name
      this.cid = cid
      this.pagenum = 0
      this.goods_list = []
      this.queryList()
    },
    /*
     * 查询商品分类信息
     */
    queryList () {
      try {
        // 查询前设置滚动为busy(禁止多次滚动进入方法);出现读取图标
        this.busy = this.showLoading = true
        // 页码加1，默认为0
        this.pagenum = this.pagenum + 1
        if (this.pagenum === -1) {
          // 分页条码为负均不加载
          return
        }
        // 获取数据
        let p = {
          type: this.cid,
          pagenum: this.pagenum,
          pagesize: 10
        }
        this.$http.post('product/productList', qs.stringify(p))
        .then(({data: {code, data, msg}}) => {
          if (code === 1) {
            // console.log(data)
            if (data.length === 0) {
              // 返回数据长度为0时,设置页码为-1
              this.pagenum = -1
              return
            }
            for (let m of data) {
              this.goods_list.push(m)
            }
          } else {
            $.toast(msg, 'forbidden')
            console.error('获取商品列表失败:' + msg)
          }
          this.busy = this.showLoading = false
        }, (response) => {
          // error callback
          console.log(response)
        })
      } finally {
        // 滑动菜单
        for (let i in this.parent_cat) {
          if (this.parent_cat[i].cat_id === this.cid) {
            console.log(i * 108 * -1)
            // $('#activeMenu').css('left', (i * 108 * -1) + 'px')
            // $('#activeMenu').animate({scrollLeft: i * 108 * -1}, 100)
          }
        }
      }
    }
  }
}
</script>

<style>
.shop-bag {
  text-align: right;
}
.shop-bag span {
  font-size: 26px;
}
</style>
