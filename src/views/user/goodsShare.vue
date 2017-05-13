<template>
  <div>
    <!-- 分享遮罩 -->
    <div class="show-share">
      <img src="/static/images/share.png">
    </div>
    <!-- 页面组件 -->
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>商品分享</span>
      </div>
      <div class="col-xs-2"></div>
    </div>
    <div class="row">
      <div class="goods-manage_box">
        <div class="goods-search_box">
          <div class="weui-search-bar goods-search_bar" id="searchBar">
            <form class="weui-search-bar__form">
              <div class="weui-search-bar__box" >
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" placeholder="搜索" required="" id="searchInput" v-model="searchContent">
                <a href="javascript:" class="weui-icon-clear" id="searchClear"></a>
              </div>
              <label class="weui-search-bar__label" id="searchText">
                <i class="weui-icon-search"></i>
                <span>搜索商品</span>
              </label>
            </form>
            <a href="javascript:" class="weui-search-bar__cancel-btn" @click="searchGood(searchContent)">搜索</a>
            <!-- <a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a> -->
          </div>
          <!-- <div class="weui-cells searchbar-result" id="searchResult">
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd weui-cell_primary">
                    <p>实时搜索文本</p>
                </div>
            </div>
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd weui-cell_primary">
                    <p>实时搜索文本</p>
                </div>
            </div>
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd weui-cell_primary">
                    <p>实时搜索文本</p>
                </div>
            </div>
            <div class="weui-cell weui-cell_access">
                <div class="weui-cell__bd weui-cell_primary">
                    <p>实时搜索文本</p>
                </div>
            </div>
          </div> -->
          <div class="goods-search_ways">
            <select class="sort" v-model="selectVal">
              <option v-for="op in options" :value="op.value">{{op.text}}</option>
            </select>
            <select class="sort" v-model="selCatId">
              <option v-for="opc in cat_arr" :value="opc.cat_id">{{opc.cat_name}}</option>
            </select>
          </div>
        </div>
        <div class="goods-search_lists"
          v-infinite-scroll="queryList"
          infinite-scroll-immediate-check="false"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="30">
          <div class="goods-list_box" v-for="gs in goods_list">
            <div class="goods-list_pic">
              <img :src="gs.master_img">
            </div>
            <div class="goods-list_detail">
              <p class="g_name">{{gs.goods_name}}</p>
              <p class="g_brief">{{gs.goods_brief}}</p>
              <span class="sale_price">销售价格：￥{{gs.shop_price}}</span>
              <span class="goods_commission">
                商品佣金：<span class="commission">￥{{gs.commission}}</span>
              </span>
              <div class="share-box" @click="share">
                <span class="iconfont-yzg icon-yzg-fenxiang share-icon"></span>
                <span class="share" id="onMenuShareTimeline">分享</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'zepto'
import wx from 'weixin-js-sdk'
import weui from 'weui.js'
import * as config from './../../config'

export default {
  activated () {
    this.searchFuc()
    this.initWechat()
    // 关闭分享遮罩
    $('.show-share').click(function() {
      $(this).hide()
    })
  },
  mounted () {
    // 模板编译之后，代替了之前的ready*
    this.$nextTick(function() {
      if (this.goods_list.length === 0) {
        // 数据为空要加载数据
        this.queryList()
      }
    })
  },
  data () {
    return {
      goods_list: [],
      cat_arr: [],
      pagenum: 0,
      showLoading: false,
      busy: true,
      sort: 'sort_order',
      options: [
        {text: '默认排序', value: '0'},
        {text: '销量排序', value: '1'},
        {text: '上新排序', value: '2'},
        {text: '佣金排序', value: '3'}
      ],
      selectVal: 0,
      selCatId: 1,
      searchContent: ''
    }
  },
  methods: {
    share() {
      // 显示分享遮罩
      $('.show-share').show()
      // console.log(typeof (window.WeixinJSBridge))
      // window.WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
      //   // 在这里拿到e.err_msg，这里面就包含了所有的网络类型
      //   console.log(e)
      // })
      // window.WeixinJSBridge.call('showToolbar')
    },
    initWechat() {
      // 去后台获取签名等信息
      this.$http.get('http://127.0.0.1:8090/api/v1/weChat/wxConfig')
      .then(({data: {data, code, msg}}) => {
        // 微信配置
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
          appId: config.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'showOptionMenu'
          ]
        })
        wx.ready(function() {
          // 在这里调用 API
          wx.onMenuShareTimeline({
            title: '标题',
            link: '链接地址',
            imgUrl: '图片地址',
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            },
            success: function (res) {
              console.log('分享完成')
            },
            cancel: function (res) {
              console.log('取消分享')
            },
            fail: function (res) {
              console.log(JSON.stringify(res))
            }
          })
        })
        wx.onMenuShareAppMessage({
          title: '分享标题', // 分享标题
          desc: '【挣外快】帅哥美女们，我当老板啦！快来我的小店逛逛，捧个场吧！不知道我当老板了？再不来【挣外快】逛逛，你就out了！', // 分享描述
          link: '分享链接', // 分享链接
          imgUrl: '分享图标', // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        wx.error(function (res) {
          console.log(res.errMsg)
        })
      }, (response) => {
        // error callback
        console.error(response)
      })
    },
    searchFuc () {
      let _this = this
      $(function() {
        var $searchBar = $('#searchBar')
        var $searchResult = $('#searchResult')
        var $searchText = $('#searchText')
        var $searchInput = $('#searchInput')
        var $searchClear = $('#searchClear')
        var $searchCancel = $('#searchCancel')

        function hideSearchResult() {
          $searchResult.hide()
          $searchInput.val('')
        }
        function cancelSearch() {
          hideSearchResult()
          $searchBar.removeClass('weui-search-bar_focusing')
          $searchText.show()
        }

        $searchText.on('click', function() {
          $searchBar.addClass('weui-search-bar_focusing')
          $searchInput.focus()
        })
        $searchInput
          .on('blur', function () {
            if (!this.value.length) cancelSearch()
          })
          .on('input', function() {
            if (this.value.length) {
              $searchResult.show()
            } else {
              $searchResult.hide()
            }
          })
        $searchClear.on('click', function() {
          hideSearchResult()
          $searchInput.focus()
          _this.searchContent = ''
          _this.goods_list = []
          _this.pagenum = 0
          _this.queryList()
        })
        $searchCancel.on('click', function() {
          cancelSearch()
          $searchInput.blur()
        })
      })
    },
    searchGood(objCont) {
      this.goods_list = []
      this.pagenum = 0
      this.searchContent = objCont  // 搜索关键字
      // this.searchType = 'result'   // 显示结果列表
      // $('.searchResult').show()
      // $('.searchTitle').hide()
      this.queryList()
      // this.searchContent = ''
      // this.hisSearch()   // 保存搜索历史
    },
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
      this.$http.get('goods_union.php?act=web_goods', {
        params: {
          page: this.pagenum,
          sort: this.sort,
          id: this.selCatId,
          keywords: this.searchContent
        }
      }).then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.cat_arr = data.cat_arr
          console.log(data)
          if (data.goods_list.length === 0) {
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
    }
  },
  watch: {
    selectVal: function (val, oldVal) {
      val === '0' ? this.sort = 'sort_order' : val === '1' ? this.sort = 'click_count' : val === '2' ? this.sort = 'add_time' : this.sort = 'commission'
      this.goods_list = []
      this.pagenum = 0
      this.queryList()
    },
    selCatId: function (val, oldVal) {
      this.goods_list = []
      this.pagenum = 0
      this.queryList()
    }
  }
}

</script>

<style>
@import '/static/style/share.css';

.weui-search-bar__label{
  font-weight: normal;
}
.searchbar-result{
  display: none;
  margin-top: 0;
  font-size: 14px;
  position: absolute;
  width: 100%;
  z-index: 2;
}
.goods-manage_box{
  padding-top: 44px;
}
.goods-manage_box .goods-search_bar{
  background:none;
}
.goods-manage_box .goods-search_ways{
  display: -webkit-flex;
  display: flex;
  padding:4px 10px;
}
.goods-manage_box .goods-search_ways .sort{
  flex:1;
  padding:4px;
  margin:4px;
  border-radius:4px;
  border:1px solid #eee;
}
.goods-manage_box .goods-list_box{
  display: -webkit-flex;
  display: flex;
  border-top: 1px solid #eee;
  padding:10px 4px;
  background: #fff;
}
.goods-manage_box .goods-list_box .goods-list_pic{
  width:95px;
}
.goods-manage_box .goods-list_box .goods-list_pic img{
  width:100%;
  border:1px solid #eee;
}
.goods-manage_box .goods-list_box .goods-list_detail{
  margin-left:10px;
  flex:1;
  position: relative;
}
.goods-manage_box .goods-list_box .goods-list_detail p{
  margin-bottom:5px;
  font-size:12px;
}
.goods-manage_box .goods-list_box .goods-list_detail .g_name{
  height: 32px;
  overflow: hidden;
}
.goods-manage_box .goods-list_box .goods-list_detail .g_brief{
  font-weight: bold;
  height: 20px;
  overflow: hidden;
  margin-right:38px;
}
.goods-manage_box .goods-list_box .goods-list_detail .sale_price, .goods-manage_box .goods-list_box .goods-list_detail .goods_commission{
  display: block;
  font-size:12px;
}
.goods-manage_box .goods-list_box .goods-list_detail .commission{
  color:#d6244f;
}
.goods-manage_box .goods-list_box .goods-list_detail .share-box{
  position: absolute;
  right: 0;
  top: 26px;
  width: 30px;
}
.goods-manage_box .goods-list_box .goods-list_detail .share-box .share-icon{
  font-size:26px;
}
.goods-manage_box .goods-list_box .goods-list_detail .share-box .share{
  position: absolute;
  bottom:-2px;
  left:2px;
  font-size:10px;
}
</style>
