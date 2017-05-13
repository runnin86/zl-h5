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
          <div class="rest_fund">剩余低佣金800</div>
          <div class="used_fund">已使用低佣金1200</div>
        </div>
        <div class="fund-content">
          <table class="table">
            <thead>
              <tr>
                <th>日期</th>
                <th>订单号</th>
                <th>订单金额</th>
                <th>使用低佣金</th>
              </tr>
            </thead>
            <tbody>
              <tr class="fund-title">
                <td>3月</td>
                <td colspan="3" class="text-right">使用低佣金：6000</td>
              </tr>
              <tr>
                <td>3月26日</td>
                <td>a123456</td>
                <td>￥3000</td>
                <td>￥450</td>
              </tr>
              <tr>
                <td>3月26日</td>
                <td>a123456</td>
                <td>￥3000</td>
                <td>￥450</td>
              </tr>
              <tr class="fund-title">
                <td>3月</td>
                <td colspan="3" class="text-right">使用低佣金：6000</td>
              </tr>
              <tr>
                <td>3月26日</td>
                <td>a123456</td>
                <td>￥3000</td>
                <td>￥450</td>
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
    return {}
  },
  activated () {
    this.dataPicker()
  },
  methods: {
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
            for (let i = 0; i < result.length; i++) {
              results.push(result[i].value)  // 不包含年月日的数组值
            }
            let s = results.join('/')
            _this.dateTime = Date.parse(s)
            console.log(_this.dateTime)
          }
        })
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
