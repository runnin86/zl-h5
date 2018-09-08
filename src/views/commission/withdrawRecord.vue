<template>
<div>
  <div class="row" style="margin-top:-14px;">
    <div class="order-list_content"
      v-infinite-scroll="loadRecord"
      infinite-scroll-immediate-check="false"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="30">
      <!-- 列表 -->
      <div class="team-order_list">
        <div class="list_items">
          <table class="table">
            <thead>
              <tr>
                <th>提现账户</th>
                <th>提现金额</th>
                <th>状态</th>
                <th>日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in recordList" style="height:46px">
                <td>{{r.withdrawType | typeWithdrawFilter}}</td>
                <td>￥{{r.withdrawMoney}}</td>
                <td>{{r.withdrawStatus | statusWithdrawFilter}}</td>
                <td>{{r.withdrawDate / 1000 | dateFilter(2)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div style="margin-top: -20px;">
    <div class="weui-loadmore" v-if="showLoading&&pagenum>-1">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-if="pagenum===-1">
      <span class="weui-loadmore__tips">暂时没有提现记录</span>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import Vue from 'vue'

Vue.filter('statusWithdrawFilter', function (value) {
  let desc = ''
  switch (value) {
    case 0:
      desc = '审核中'
      break
    case 1:
      desc = '通过'
      break
    case 2:
      desc = '拒绝'
      break
    default:
      desc = ''
      break
  }
  return desc
})

Vue.filter('typeWithdrawFilter', function (value) {
  let desc = ''
  switch (value) {
    case 1:
      desc = '银行卡'
      break
    case 2:
      desc = '支付宝'
      break
    case 3:
      desc = '微信'
      break
    default:
      desc = ''
      break
  }
  return desc
})

export default {
  data() {
    return {
      recordList: [],
      pagenum: 0,
      showLoading: false,
      busy: true
    }
  },
  activated() {
    this.recordList = []
    this.pagenum = 0
    /* 获取用户提现记录 */
    this.loadRecord()
  },
  methods: {
    loadRecord() {
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
        this.$http.get('user/withdrawList', {
          params: {
            pagenum: this.pagenum,
            pagesize: 20
          },
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        })
        .then(({data: {code, data, msg}}) => {
          if (code === 1) {
            console.log(data)
            if (data.length === 0) {
              // 返回数据长度为0时,设置页码为-1
              this.pagenum = -1
              return
            }
            for (let m of data) {
              this.recordList.push(m)
            }
          } else {
            $.toast(msg, 'forbidden')
            console.error('获取提现列表失败:' + msg)
          }
          this.busy = this.showLoading = false
        }, (response) => {
          // error callback
          console.log(response)
        })
      } finally {
      }
    }
  }
}
</script>

<style scoped>
.weui-picker__item{
  padding: 0;
  height: 34px;
  line-height: 34px;
}
.icon-ajust-css{
  font-size:26px;
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
.time_filter{
  font-size:20px;
}
.order-list_title .weui-navbar__item.weui-bar__item_on{
  background-color:#d6244f;
  color:#fff;
}
.order-list_title .weui-navbar{
  position: relative;
  z-index: 1;
}
.bz-tg .bz-content .bz-title{
  line-height:2;
  font-size:14px;
  text-align:center;
}
.bz-tg .bz-content .text-control{
  margin: 10px 0 20px;
  height: 44px;
}
.bz-tg .bz-content .btn-xg{
  width:100%
}
.bz-close{
  position: absolute;
  right: 5px;
  top: 0;
  font-size: 20px;
}
.bz-tg{
  position: fixed;
  display: none;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.8);
  height: 100%;
  z-index: 99999;
}
.bz-tg .bz-content{
  border: 1px solid #666;
  border-radius: 6px;
  padding: 20px;
  margin: 0 auto;
  width: 300px;
  position: relative;
  top: 30%;
  background: #fff;
  text-align: center;
}
.reks{width:60px;}
.service_provider{
  display: block;
  font-size:12px;
}
.table>tbody>tr>td, .table>tbody>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    padding: 8px 0;
    vertical-align: middle;
}
table, th{text-align: center;}
.sell_amount{
  display: -webkit-flex;
  display: flex;
  padding:6px 15px;
  background: #fff;
}
.list_items{
  background: #fff;
  margin-top:10px;
}
.sell_amount .members{
  flex:1;
}
.sell_amount .buy_amount{
  flex:1;
}
.sell_amount .amount{
  flex:1;
  text-align: right;
}
.sell_amount .amount .number{
  color:#d6244f;
}
.sell_amount span{
  display: block;
}
.icon-yzg-paixu{
  color: #ef0021;
  position: relative;
}
.icon-yzg-paixu:after {
  content: '';
  background: #fff;
  width: 16px;
  position: absolute;
  left: 0px;
  height: 20px;
  opacity: 0.6;
}
.arrow_up:after{
  content: '';
  background: #fff;
  width: 8px;
  position: absolute;
  left: 8px;
  height: 20px;
  opacity: 0.6;
}
.arrow_down:after{
  content: '';
  background: #fff;
  width: 8px;
  position: absolute;
  left: 0;
  height: 20px;
  opacity: 0.6;
}
.arrow_up2:after{
  content: '';
  background: #fff;
  width: 8px;
  position: absolute;
  left: 8px;
  height: 20px;
  opacity: 0.6;
}
.arrow_down2:after{
  content: '';
  background: #fff;
  width: 8px;
  position: absolute;
  left: 0;
  height: 20px;
  opacity: 0.6;
}
.arrow_up3:after{
  content: '';
  background: #fff;
  width: 8px;
  position: absolute;
  left: 8px;
  height: 20px;
  opacity: 0.6;
}
.arrow_down3:after{
  content: '';
  background: #fff;
  width: 8px;
  position: absolute;
  left: 0;
  height: 20px;
  opacity: 0.6;
}
.service_provider_name {
  width: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  height: 19px;
  white-space: nowrap;
}
</style>
