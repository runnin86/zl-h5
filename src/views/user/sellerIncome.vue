<template>
<div>
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>我的佣金</span>
    </div>
    <div class="col-xs-2" id="showDatePicker">
      <span class="iconfont-yzg icon-yzg-shijianshezhianniux icon-ajust-css"></span>
    </div>
  </div>

  <div class="row">
    <div class="fund-box">
      <div class="fund-content">
        <table class="table" v-if="monthIncome.length>0">
          <thead>
            <tr>
              <th>日期</th>
              <th>佣金</th>
              <th>订单号</th>
              <th>状态</th>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <th>合计</th>
              <td colspan="3">￥{{total}}</td>
            </tr>
          </tfoot>

          <tbody>
            <tr v-for="item in monthIncome">
              <td>{{item.time}}</td>
              <td>￥{{item.money}}</td>
              <td>{{item.ono}}</td>
              <td>{{item.status===0?'冻结':'正常'}}</td>
            </tr>
          </tbody>
        </table>
        <div class='noIncome' v-else>
          <i class="iconfont-yzg icon-yzg-kulian"></i>
          <p>此月份暂时没有佣金<br/>赶快去购物吧!</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'

let loading
export default {
  computed: {
    total () {
      return this.monthIncome.reduce((total, b) => {
        return total + b.money
      }, 0)
    }
  },
  data() {
    return {
      monthIncome: []
    }
  },
  activated() {
    loading = weui.loading('加载中')
    this.monthIncome = []
    this.loadIncome()
    this.dataPicker()
  },
  methods: {
    loadIncome(queryMonth) {
      loading = weui.loading('加载中')
      this.monthIncome = []
      let url = 'user/brokerageList' + (queryMonth ? '?month=' + queryMonth : '')
      this.$http.get(url, {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        if (code === 1) {
          // console.log(data)
          if (data.length === 0) {
            // $.toast('暂时没有此月份佣金记录', 'cancel')
          } else {
            // 赋值展示
            this.monthIncome = data
          }
        } else {
          console.error('获取数据失败:' + msg)
        }
        loading.hide()
      }, (response) => {
        loading.hide()
        // error callback
        console.error(response)
      })
    },
    dataPicker() {
      let zhis = this
      $('#showDatePicker').on('click', function() {
        weui.datePicker({
          start: 2016,
          end: new Date().getFullYear(),
          onChange: function(result) {
            let results = []
            $('.weui-picker__bd .weui-picker__group').last().css('display', 'none')
            for (let i = 0; i < result.length; i++) {
              results.push(result[i].label) // 包含年月日的数组值
            }
          },
          onConfirm: function(result) {
            let results = []
            for (let i = 0; i < result.length; i++) {
              result[i].value = result[i].value < 10 ? '0' + result[i].value : result[i].value
              results.push(result[i].value) // 不包含年月日的数组值
            }
            let s = results.join('-')
            // 只获取月份
            s = s.substring(0, 7)
            // 去重新查询
            zhis.loadIncome(s)
          }
        })
        $('.weui-picker__bd .weui-picker__group').last().css('display', 'none')
      })
    }
  }
}
</script>

<style>
.weui-picker__item {
  padding: 0;
  height: 34px;
  line-height: 34px;
}

.icon-ajust-css {
  font-size: 26px;
}

.weui-picker__bd .weui-picker__group:last-child {
  display: none
}

.noIncome {
  text-align: center;
  padding: 30px;
  color: #d6244f;
}

.noIncome .iconfont-yzg {
  font-size: 60px
}

.noIncome p {
  padding: 10px;
  line-height: 1.8
}
</style>
