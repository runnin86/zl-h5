<template>
<div class="container container-content">
  <div class="row yzg-title" style="position:relative;width:auto;margin-bottom: 6px;">
    <div class="col-xs-2 backBtn">
      <!-- <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a> -->
    </div>
    <div class="col-xs-8 shop-name">
      <span>{{title_name}}</span>
    </div>
    <!-- <div class="col-xs-2 shop-bag">
      <router-link :to="{ name: 'Index',path: '/index'}">
        <span class="iconfont-yzg icon-yzg-fudaoshangcheng"></span>
      </router-link>
    </div> -->
  </div>

  <!-- 滑动菜单 -->
  <div class="row navbar-location" v-show="sortMenu.length>0">
    <div class="navbar-yzg-default">
      <wv-scroll-menu ref="menuComp" :sortMenu="sortMenu" :sortName="sortName"
        :isSortName="true" :fnName="'changeCid'" :activeId="cid">
      </wv-scroll-menu>
    </div>
  </div>

  <div class="row recommend-goods">
    <div class="goods-lists clearfix"
      v-infinite-scroll="queryList"
      infinite-scroll-immediate-check="false"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="30">
      <a v-for="g in goods_list" class="sub-goods_list">
        <router-link :to="{ name: 'Goods',path: '/shopping/goods', query: { gid: g.productId }}">
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
        <div class="goods-title"
          v-html="g.productName+(g.productDesc?'('+g.productDesc+')':'')">
        </div>
        <div class="goods-price">
          ￥{{g.price}}
          <span class="market_price_span_add">￥{{g.marketPrice}}</span>
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
// import weui from 'weui.js'

// import Vue from 'vue'
// import progressive from './../../directives/progressive-image'
//
// Vue.use(progressive, {
//   removePreview: true,
//   scale: true
// })
let menuList = [{
  id: 0,
  name: '全部商品'
}, {
  id: 1,
  name: '新能源系列'
}, {
  id: 2,
  name: '五金卫浴'
}, {
  id: 3,
  name: '家电系列'
}, {
  id: 4,
  name: '生活用品'
}, {
  id: 5,
  name: '母婴产品'
}, {
  id: 6,
  name: '酒水类'
}, {
  id: 7,
  name: '特色产品'
}]

export default {
  data () {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      goods_list: [],
      img_domain: 'http://img.zulibuy.com/images/',
      title_name: '全部商品',
      cid: 0,
      pagenum: 0,
      showLoading: false,
      busy: true,
      sortMenu: menuList,
      sortName: menuList
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
    $(window).scrollTop(this.$parent.scrollTop)
    let _this = this
    $(document).ready(function () {
      $('.navbar-location').css({'position': 'relative', 'width': 'auto'})
      $(window).scroll(function () {
        // 滑动菜单不展开
        _this.$refs.menuComp.subitemsExpanded = false
        let scrollT = $(window).scrollTop()
        if (scrollT < 44) {
          $('.navbar-location').css({'position': 'relative', 'width': 'auto'})
        } else {
          $('.navbar-location').css({'position': 'fixed', 'width': '100%', 'top': '0'})
        }
      })
    })
    // 获取滑动菜单组件的事件通信
    this.$on('changeCid', function (id) {
      this.changeCid(id)
    })
  },
  methods: {
    /*
     * 分类点击
     */
    changeCid (cid) {
      // this.title_name = this.sortMenu[value = cid]
      this.title_name = this.sortMenu[cid].name
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
        for (let i in this.sortMenu) {
          if (this.sortMenu[i].id === this.cid) {
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
.recommend-goods {
  padding-top:0;
}
.market_price_span_add {
  color: #777;
  text-decoration: line-through;
  font-size: 12px;
  padding-left: 5px;
}
</style>
