<template>
  <div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>订单管理</span>
      </div>
      <div class="col-xs-2" id="showDatePicker" @click="dataPicker(judge)">
        <span class="iconfont-yzg icon-yzg-shijianshezhianniux icon-ajust-css"></span>
      </div>
    </div> 
    <div class="row">
      <div class="order-list_box">
        <div class="order-list_title">
          <span @click="toggleOrder(true)" :class="judge ? 'redBgColor' : '' ">我的销售订单</span>
          <span @click="toggleOrder(false)" :class="judge ? '' : 'redBgColor' ">团队销售订单</span>
        </div>
        <div class="order-list_content">
          <div class="order-list_items" 
          v-infinite-scroll="queryList"
          infinite-scroll-immediate-check="false"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="30">
            <table class="table" v-if="judge">
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>用户名</th>
                  <th>订单金额</th>
                  <th>所得佣金</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody v-for="ol in order_list">
                <tr>
                  <td>{{ol.order_sn}}</td>
                  <td v-if="ol.nickname">{{ol.nickname}}</td>
                  <td v-else>{{ol.user_name}}</td>
                  <td>{{ol.goods_price}}</td>
                  <td>{{ol.commission}}</td>
                  <td>
                    <router-link :to="{name: 'ShopOrdDet', path: '/shopOrdDet', 
                    query: { 
                      orderIdSell: ol.order_id
                    }}" class="check-order_detail">查看</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 团队销售订单 -->
            <table class="table" v-else>
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>订单金额</th>
                  <th>所属分销商</th>
                  <th>我的佣金</th>
                </tr>
              </thead>
              <tbody v-for="ot in order_info_team">
                <tr>
                  <td>{{ot.order_sn}}</td>
                  <td>{{ot.goods_price}}</td>
                  <td v-if="ot.nickname">{{ot.nickname}}</td>
                  <td v-else>{{ot.user_name}}</td>
                  <td>{{ot.commission}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'zepto'
import weui from 'weui.js'

export default{
  data () {
    return {
      judge: true,
      order_info_team: [],
      order_list: [],
      orderData: [],
      pagenum: 0,
      showLoading: false,
      busy: true
    }
  },
  methods: {
    toggleOrder (judge) {
      this.judge = judge
      if (judge) {
        this.pagenum = 0
        this.order_list = []
        this.queryList()
      } else {
        this.pagenum = 0
        this.order_info_team = []
        this.queryList()
      }
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
      this.$http.get('order_union.php', {
        params: {
          page: this.pagenum
        }
      }).then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // console.log(data)
          if (this.judge) {
            this.orderData = data.order_list
            for (let m of this.orderData) {
              this.order_list.push(m)
            }
            if (this.orderData.length === 0 || this.pagenum >= data.pager.page_count) {
              // 返回数据长度为0时,设置页码为-1
              this.pagenum = -1
              return
            }
          } else {
            this.orderData = data.order_info_team
            for (let m of this.orderData) {
              this.order_info_team.push(m)
            }
            if (this.orderData.length === 0 || this.pagenum >= data.pager_team.page_count) {
              // 返回数据长度为0时,设置页码为-1
              this.pagenum = -1
              return
            }
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
    dataPicker (judge) {
      let _this = this
      weui.datePicker({
        start: 1990,
        end: new Date().getFullYear(),
        onChange: function (result) {
          let results = []
          for (let i = 0; i < result.length; i++) {
            results.push(result[i].label)  // 包含年月日的数组值
          }
          // console.log(results)
        },
        onConfirm: function (result) {
          let results = []
          let sx_self = []
          let sx_team = []
          results.push(result[0].value)
          for (let i = 1; i < result.length; i++) {
            if (result[i].value < 10) {
              results.push('0' + result[i].value)
              // 不包含年月日的数组值
            } else {
              results.push(result[i].value)
            }
          }
          if (judge) {
            for (let i = 0; i < _this.orderData.length; i++) {
              if (_this.orderData[i].add_time.slice(0, 10) === results.join('-')) {
                sx_self.push(_this.orderData[i])
              }
            }
            _this.order_list = sx_self
          } else {
            for (let i = 0; i < _this.orderData.length; i++) {
              if (_this.orderData[i].add_time.slice(0, 10) === results.join('-')) {
                sx_team.push(_this.orderData[i])
              }
            }
            _this.order_info_team = sx_team
          }
        }
      })
    }
  },
  activated () {
    this.order_list = []
    this.pagenum = 0
    this.queryList()
  }
}
</script>

<style>
.weui-picker__item{
  padding: 0;
  height: 34px;
  line-height: 34px;
}
.order-list_box{
  padding-top:44px;
}
.order-list_content .order-list_items{
  background: #fff;
}
.order-list_box .order-list_title{
  padding:10px 15px;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
}
.order-list_box .order-list_title span{
  border:1px solid #ccc;
  padding:6px;
  cursor: pointer;
  flex:1;
  text-align: center;
}
.icon-ajust-css{
  font-size:26px;
}
</style>
