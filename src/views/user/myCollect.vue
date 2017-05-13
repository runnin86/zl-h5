<template>
<div class="container container-content">
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>{{title_name}}</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <span class="iconfont-yzg icon-yzg-fudaoshangcheng"></span>
    </div>
  </div>
  <div class="row recommend-goods category-goods" style=" padding-top:44px">
    <div class="goods-lists clearfix"
      v-infinite-scroll="queryList"
      infinite-scroll-immediate-check="false"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="30">
      <a v-for="g in goods_list" class="sub-goods_list collect_list">
        <router-link :to="{ name: 'Goods',path: '/shopping/goods', query: { gid: g.goods_id }}">
          <div class="goods-img">
            <img :src="imgBase64"
              :style="{backgroundImage: 'url(' + (g.goods_img?img_domain+g.goods_img:'/static/images/no_picture.jpg') + ')'}">
          </div>
        </router-link>
        <div class="goods-title" v-html="g.goods_name"></div>
        <div class="goods-price">{{g.shop_price}}</div>
        <div class="quitCollect">
          <a @click="quitColById(g.rec_id)">取消收藏</a><router-link :to="{ name: 'Goods',path: '/shopping/goods', query: { gid: g.goods_id }}">去购买</router-link>
        </div>
      </a>
    </div>
  </div>
  <div class="weui-loadmore" v-if="showLoading&&pagenum>-1">
    <i class="weui-loading"></i>
    <span class="weui-loadmore__tips">正在加载</span>
  </div>
  <div class="weui-loadmore weui-loadmore_line" v-if="pagenum===-1">
    <span class="weui-loadmore__tips">暂无更多数据</span>
  </div>
</div>
</template>

<script>
import weui from 'weui.js'
// import qs from 'qs'

export default {
  data () {
    return {
      imgBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
      goods_list: [],
      img_domain: '',
      title_name: '',
      pagenum: 0,
      showLoading: false,
      busy: true,
      delId: ''
    }
  },
  mounted () {
    // this.queryList()
  },
  /*
   * 激活
   */
  activated () {
    this.goods_list = []
    this.pagenum = 0
    this.showLoading = false
    this.busy = true
    this.queryList()
    // let _this = this
  },
  methods: {
    /*
     * 查询商品分类信息
     */
    queryList () {
      // 查询前设置滚动为busy(禁止多次滚动进入方法);出现读取图标
      this.busy = this.showLoading = true
      // 页码加1，默认为0
      this.pagenum = this.pagenum + 1
      if (this.pagenum === -1) {
        // 分页条码为负均不加载
        return
      }
      // 获取数据
      this.$http.get('user.php?act=collection_list', {
        params: {
          page: this.pagenum
        }
      }).then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          console.log(data)
          this.img_domain = data.img_domain
          this.title_name = data.title_name
          console.log(data.goods_list.length)
          if (data.goods_list.length === 0 || data.pager.page_count < this.pagenum) {
            // 返回数据长度为0时,设置页码为-1
            this.pagenum = -1
            return
          }
          for (let m of data.goods_list) {
            this.goods_list.push(m)
          }
        } else {
          weui.toast(msg, 2000)
          console.error('获取商品列表失败:' + msg)
        }
        this.busy = this.showLoading = false
      }, (response) => {
        // error callback
        console.log(response)
      })
    },
    /*
    *取消收藏
    */
    quitColById(id) {
      this.getId(id)
      console.log('删除id' + this.delId)
      weui.confirm('是否确定删除当前所收藏商品', () => {
        this.$http.get('user.php?act=delete_collection', {
          params: {
            collection_id: id
          }
        })
        .then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            console.log(data)
            this.goods_list.splice(this.delId, 1)
            weui.toast('删除收藏成功')
          } else {
            console.log(errcode)
          }
        }, (response) => {
          // error callback
          console.error(response)
        })
      }, () => {
        // f
      })
    },
    getId(objId) {
      let _this = this
      this.goods_list.forEach(function(item, index) {
        console.log('index:' + item)
        if (item.rec_id === objId) {
          console.log('fs' + index)
          _this.delId = index
        }
      })
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
/*收藏*/
.quitCollect a{ color:#d6244f; text-align: center; height:40px; line-height: 40px; display: inline-block; width: 50%; border-top:1px solid #eee; cursor: pointer; }
.quitCollect a:first-child{ border-right:1px solid #eee; color:#999; }
</style>
