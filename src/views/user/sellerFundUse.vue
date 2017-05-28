<template>
  <div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>资金用途明细</span>
      </div>
      <div class="col-xs-2" id="showDatePicker">
        <span class="iconfont-yzg icon-yzg-shijianshezhianniux icon-ajust-css"></span>
      </div>
    </div> 

    <div class="row">
      <div class="fund-box">
        <div class="fund-header">
          <div class="rest_fund">剩余抵用金：￥{{offset_money}}</div>
          <div class="used_fund">已使用抵用金：￥{{total_used_offset}}</div>
        </div>
        <div class="fund-content">
          <table class="table">
            <thead>
              <tr>
                <th>日期</th>
                <th>订单号</th>
                <th>订单金额</th>
                <th>使用抵用金</th>
              </tr>
            </thead>
            <tbody v-for="oi in orderInfo">
              <tr class="fund-title" v-if="oi.order_month">
                <td>{{oi.order_month}}月</td>
                <td colspan="3" class="text-right">使用抵用金：￥{{oi.used_offset}}</td>
              </tr>
              <tr v-for="or in oi" v-if="or.add_time">
                <td>{{or.add_time}}</td>
                <td>{{or.order_sn}}</td>
                <td>{{or.order_amount}}</td>
                <td>{{or.offset}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'

export default{
  data () {
    return {
      offset_money: '',
      order_info: [],
      total_used_offset: '',
      orderInfo: []
    }
  },
  activated () {
    this.loadData()
    this.dataPicker()
  },
  methods: {
    loadData () {
      this.$http.get('/store.php', {
        params: {
          act: 'offset_used'
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.offset_money = data.offset_money
          this.order_info = data.order_info
          this.total_used_offset = data.total_used_offset
          this.orderInfo = this.order_info
          console.log(data)
        } else {
          weui.toast(msg, 2000)
          console.error('获取商品列表失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.log(response)
      })
    },
    dataPicker () {
      let _this = this
      $('#showDatePicker').on('click', function () {
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
            let sx_team = []
            let or_info = []
            results.push(result[0].value)
            for (let i = 1; i < result.length; i++) {
              if (result[i].value < 10) {
                results.push('0' + result[i].value)
                // 不包含年月日的数组值
              } else {
                results.push(result[i].value)
              }
            }
            let s = results.join('-').toString()
            for (let i = 0; i < _this.order_info.length; i++) {
              for (let m in _this.order_info[i]) {
                if (_this.order_info[i][m].add_time === s) {
                  sx_team.push(_this.order_info[i][m])
                  console.log(sx_team)
                }
              }
            }
            or_info.push(sx_team)
            _this.orderInfo = or_info
          }
        })
        // $('.weui-picker__bd .weui-picker__group').last().css('display', 'none')
      })
    }
  }
}
</script>

<style>
.weui-picker__item{
  padding: 0;
  height: 34px;
  line-height: 34px;
}
.icon-ajust-css{
  font-size:26px;
}
</style>
