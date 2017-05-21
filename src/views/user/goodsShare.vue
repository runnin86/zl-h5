<template>
  <div>
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
              <option value="0">全部商品</option>
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
              <img :src="union_domain + gs.master_img">
            </div>
            <div class="goods-list_detail">
              <p class="g_name">{{gs.goods_name}}</p>
              <p class="g_brief">{{gs.goods_brief}}</p>
              <span class="sale_price">销售价格：￥{{gs.shop_price}}</span>
              <!-- <span class="goods_commission">
                商品佣金：<span class="commission">￥{{gs.commission}}</span>
              </span> -->
              <router-link :to="{name: 'Goods',path: '/shopping/goods',
                params: {from: 'share'},
                query: {gid: gs.upc_id}}">
                <div class="share-box">
                  <span class="iconfont-yzg icon-yzg-fenxiang share-icon"></span>
                  <span class="share" id="onMenuShareTimeline">分享</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'

export default {
  activated () {
    this.searchFuc()
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
        {text: '上新排序', value: '2'}
      ],
      selectVal: 0,
      selCatId: 0,
      searchContent: ''
    }
  },
  methods: {
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
          this.union_domain = data.union_domain
          // console.log(data)
          if (data.goods_list.length === 0) {
            // 返回数据长度为0时,设置页码为-1
            this.pagenum = -1
            return
          }
          if (!this.searchContent) {
            if (this.pagenum > data.page_count) {
              // 返回数据长度为0时,设置页码为-1
              this.pagenum = -1
              return
            }
          } else {
            if (this.pagenum > data.page_count) {
              // 返回数据长度为0时,设置页码为-1
              this.pagenum = -1
              return
            }
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
      val === '0' ? this.sort = 'sort_order' : val === '1' ? this.sort = 'click_count' : this.sort = 'add_time'
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
.goods-search_box{
  background: #fcfcfc;
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
  font-size:12px;
}
.goods-manage_box .goods-list_box .goods-list_detail .g_name{
  height: 38px;
  overflow: hidden;
}
.goods-manage_box .goods-list_box .goods-list_detail .g_brief{
  font-weight: bold;
  height: 20px;
  overflow: hidden;
  margin-right:38px;
  margin-bottom:6px;
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
