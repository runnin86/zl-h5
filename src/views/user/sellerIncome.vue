<template>
  <div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>我的收入</span>
      </div>
      <div class="col-xs-2" id="showDatePicker">
        <span class="iconfont-yzg icon-yzg-shijianshezhianniux icon-ajust-css"></span>
      </div>
    </div> 

    <div class="row">
      <div class="fund-box">
        <div class="fund-content">
          <table class="table" v-if = "hasIncome">
            <thead>
              <tr>
                <th>日期</th>
                <th>佣金</th>
                <th>推广奖励</th>
                <th>团队奖励</th>
              </tr>
              <tr>
                <th>合计</th>
                <td>￥{{incomeData.pay_commission_total}}</td>
                <td>￥{{incomeData.shop_commission_total}}</td>
                <td>￥{{incomeData.team_commission_total}}</td>
              </tr>
            </thead>
            <tbody v-for = " (t, itemIndex) in monthIncome">
              <tr class="fund-title">
                <td colspan="4">{{itemIndex}}</td>
              </tr>
              <tr v-for = "item in monthIncome[itemIndex]">
                <td>{{item.add_time}}</td>
                <td>￥{{item.pay_commission}}</td>
                <td>￥{{item.shop_commission}}</td>
                <td>￥{{item.team_commission}}</td>
              </tr>
            </tbody>
          </table>
          <div class='noIncome' v-else>
            <i class="iconfont-yzg icon-yzg-kulian"></i>
            <p>暂时没有收入<br/>快去推广挣钱吧！！！！！</p>
          </div>
          <div class="loading" v-if="load">
            <i class="weui-loading"></i>
          </div>
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
      incomeData: {},  // 初始化数据
      monthIncome: {},  // 分月整理 筛选当月收入及初始显示
      totalIncome: {},  // 根据月份保存全部收入
      hasIncome: true,  // 判断是否有收入
      load: true   // 显示正在加载
    }
  },
  activated () {
    this.incomeData = this.monthIncome = this.totalIncome = {}
    this.hasIncome = true
    this.load = true
    this.loadIncome()
    this.dataPicker()
  },
  methods: {
    loadIncome () {
      this.$http.get('lncome_union.php')
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          if (data.commission) {
            this.incomeData = data
            this.eachMonthIncome()
          } else {
            this.hasIncome = false
          }
          this.load = false
        } else {
          console.error('获取数据失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.error(response)
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
            $('.weui-picker__bd .weui-picker__group').last().css('display', 'none')
            for (let i = 0; i < result.length; i++) {
              results.push(result[i].label)  // 包含年月日的数组值
            }
          },
          onConfirm: function (result) {
            let results = []
            for (let i = 0; i < result.length; i++) {
              result[i].value = result[i].value < 10 ? '0' + result[i].value : result[i].value
              results.push(result[i].value)  // 不包含年月日的数组值
            }
            let s = results.join('-')
            s = s.substring(0, 7) // 只获取月份
            // _this.dateTime = Date.parse(s) // 将当前时间转化为时间戳
            _this.dateTime = s
            // _this.filterTime
            if (!_this.totalIncome[s]) {
              $.toast('暂时没有此月份收入记录', 'cancel')
            } else {
              // 获取当前选定月份收入 并赋值
              _this.monthIncome = {}
              _this.monthIncome[s] = _this.totalIncome[s]
            }
          }
        })
        $('.weui-picker__bd .weui-picker__group').last().css('display', 'none')
      })
    },
    /*
    * 时间戳转换年月
    */
    // shiftTime(timeObj) {
    //   // return new Date(parseInt(timeObj) * 1000).toLocaleString().substr(0, 7)
    //   var d = new Date(timeObj * 1000)    // 根据时间戳生成的时间对象
    //   var date = (d.getFullYear()) + '-' + (d.getMonth() + 1) + '-' + (d.getDate())
    //   return date
    // },
    /*
    * 整理各月收入
    */
    eachMonthIncome () {
      let mouthTime = ''
      for (var o in this.incomeData.commission) {
        mouthTime = o.substring(0, 7)  // 只获取月份
        this.totalIncome[mouthTime] = this.totalIncome[mouthTime] ? this.totalIncome[mouthTime] : []
        this.totalIncome[mouthTime].push(this.incomeData.commission[o])  // 填充当月数据
      }
      this.monthIncome = this.totalIncome  // 保存全部收入
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
.weui-picker__bd .weui-picker__group:last-child{ display: none }
.noIncome{ text-align: center; padding:30px; color:#d6244f; }
.noIncome .iconfont-yzg{ font-size: 60px }
.noIncome p{ padding:10px; line-height: 1.8}
</style>
