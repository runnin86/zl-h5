<template>
<div>
  <div class="row yzg-title" style="position:relative;width:auto;margin-bottom: 6px;">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>提现记录</span>
    </div>
  </div>

  <div v-if="record">
    <div class="cashRecord row">
      <div class="col-xs-6">
        <p>合计提现次数</p>
        <span>{{record.count}}</span>次
      </div>
      <div class="col-xs-6">
        <p>合计提现金额</p>
        <span>￥{{record.amount}}</span>
      </div>
    </div>
    <div class="row recordDet">
      <table>
        <tr>
          <th>提现时间</th>
          <th>提现金额</th>
        </tr>
        <tr v-for="record in record.user_account">
          <td>{{record.add_time}}</td>
          <td>￥{{record.amount}}</td>
        </tr>
      </table>
    </div>
  </div>
  <div style="padding-bottom: 2px;">
    <div class="weui-loadmore" v-if="showLoading&&pagenum>-1">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-if="pagenum===0">
      <span class="weui-loadmore__tips">暂时没有提现记录</span>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'

export default {
  data() {
    return {
      record: null,
      pagenum: 0,
      showLoading: false
    }
  },
  activated() {
    this.record = null
    /* 获取用户提现记录 */
    this.loadRecord()
  },
  methods: {
    loadRecord() {
      this.$http.get('lncome_union.php', {
        params: {
          act: 'cash_record'
        }
      }).then(function({data: {data, code, msg}}) {
        if (code === 0) {
          this.record = data
        } else {
          $.toast(msg, 'forbidden')
        }
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.cashRecord {
  background: #fff;
  padding: 54px 15px 15px;
}

.cashRecord .col-xs-6 {
  padding: 10px;
  text-align: center
}

.cashRecord .col-xs-6 p {
  line-height: 28px;
  padding-bottom: 8px;
}

.cashRecord .col-xs-6 span {
  font-size: 18px;
  color: #d6244f;
}

.recordDet table {
  width: 100%;
}

.recordDet table td,
.recordDet table th {
  width: 50%;
  text-align: center;
  height: 2rem;
  line-height: 2rem
}

.recordDet table td {
  border-top: 1px solid #f8f8f8;
}

.recordDet table th {
  background: #f8f8f8
}

.recordDet {
  margin-top: 10px;
  background: #fff
}
</style>
