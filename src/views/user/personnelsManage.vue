<template>
  <div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>客户管理</span>
      </div>
      <div class="col-xs-2" id="showDatePicker">
        <span class="iconfont-yzg icon-yzg-shijianshezhianniux icon-ajust-css"></span>
      </div>
    </div> 
    <div class="row">
      <div class="order-list_box">
        <!-- <div class="order-list_title">
          <span @click="toggleOrder(true)" :class="judge ? 'order_classify' : '' ">我的分销商</span>
          <span @click="toggleOrder(false)"  :class="judge ? '' : 'order_classify' ">我的客户</span>
        </div> -->
        <div class="order-list_title">
          <div class="weui-navbar">
            <div class="weui-navbar__item weui-bar__item_on"  @click="toggleOrder(true)">
              我的分销商
            </div>
            <div class="weui-navbar__item" @click="toggleOrder(false)">
              我的客户
            </div>
          </div>
        </div>
        <div class="order-list_content">
          <div class="self-order_list" v-if="judge">
            <div class="sell_amount">
              <div class="members">
                <span>共计：</span>
                <span>{{count_user}}人</span>
              </div>
              <div class="amount">
                <span>团队销售额</span>
                <span class="number" v-text="goods_amount"></span>
              </div>
            </div>
            <div class="list_items">
              <table class="table">
                <thead>
                  <tr>
                    <th>成员</th>
                    <th>订单数</th>
                    <th>销售额<span class="iconfont-yzg icon-yzg-paixu"></span></th>
                    <th>我的佣金<span class="iconfont-yzg icon-yzg-paixu"></span></th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ulist in user_list">
                    <td>
                      <span v-if="ulist.remark">{{ulist.remark}}</span>
                      <span v-else-if="ulist.nickname">{{ulist.nickname}}</span>
                      <span v-else="ulist.user_name">{{ulist.user_name}}</span>
                      <span class="service_provider">(服务商)</span>
                    </td>
                    <td>{{ulist.order_count}}</td>
                    <td>￥{{ulist.amount_count}}</td>
                    <td>￥{{ulist.commission}}</td>
                    <td @click = "remark(ulist.user_id)">
                      <span class="iconfont-yzg icon-yzg-beizhu"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 团队销售订单 -->
          <div class="team-order_list" v-else>
            <div class="sell_amount">
              <div class="members">
                <span>共计：</span>
                <span v-text="ct_count_user">人</span>
              </div>
              <div class="buy_amount">
                <span>累计购物额:</span>
                <span v-text="ct_goods_amount"></span>
              </div>
              <div class="amount">
                <span>获得佣金</span>
                <span class="number" v-text="ct_total_commission"></span>
              </div>
            </div>
            <div class="list_items">
              <table class="table">
                <thead>
                  <tr>
                    <th>成员</th>
                    <th>购物订单数</th>
                    <th>购物金额<span class="iconfont-yzg icon-yzg-paixu"></span></th>
                    <th>我的佣金<span class="iconfont-yzg icon-yzg-paixu"></span></th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ct in ct_user_list">
                    <td>
                      <span v-if="ct.remark">{{ct.remark}}</span>
                      <span v-else-if="ct.nickname">{{ct.nickname}}</span>
                      <span v-else="ct.user_name">{{ct.user_name}}</span>
                    </td>
                    <td>{{ct.order_count}}</td>
                    <td>￥{{ct.amount_count}}</td>
                    <td>￥{{ct.commission}}</td>
                    <td @click = "remark(ct.user_id)">
                      <span class="iconfont-yzg icon-yzg-beizhu"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bz-tg">
      <div class="bz-content">
        <p class="bz-title" style=" line-height:2; font-size:14px;text-align:center"></p>
        <input type="text" class="form-control text-control" placeholder="添加/修改备注" value="" 
         v-model="nikeName"/>
        <a href="javascript:;void(0)" @click="save" class="btn btn-danger btn-xg">确认修改</a>
        <a class="bz-close" href="javascript:void(0);">&times;</a>
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
      judge: true,
      count_user: 0,
      goods_amount: 0,
      user_list: [],
      ct_count_user: 0,
      ct_goods_amount: 0,
      ct_total_commission: 0,
      ct_user_list: [],
      nikeName: '',
      currentId: ''
    }
  },
  methods: {
    toggleOrder (judge) {
      this.judge = judge
    },
    save () {
      this.ct_user_list[this.currentId].remark = this.nikeName
      if (this.ct_user_list[this.currentId].user_id === this.user_list[this.currentId].user_id) {
        this.user_list[this.currentId].remark = this.ct_user_list[this.currentId].remark
      }
      $('.bz-tg').css('display', 'none')
      // 我的客户备注接口
      this.$http.post('user_union.php', {
        params: {
          tuid: this.currentId,
          remark: this.nikeName
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // console.log(data)
          weui.alert('修改成功')
        } else {
          console.error('获取数据失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.error(response)
      })
    },
    remark (id) {
      this.currentId = id
      let org = this.ct_user_list[id].remark
      $('.bz-tg input').val('')
      $('.bz-tg').css('display', 'block')
      $('.bz-tg p').html('为 <span style="color:#d6244f">' + org + '</span> 设置备注')
      $('.bz-close').on('click', function() {
        $('.bz-tg').css('display', 'none')
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
            for (let i = 0; i < result.length; i++) {
              results.push(result[i].value)  // 不包含年月日的数组值
            }
            let s = results.join('/')
            _this.dateTime = Date.parse(s)
            console.log(_this.dateTime)
          }
        })
      })
    },
    loadClients () {
      // 我的客户接口
      this.$http.get('client_union.php')
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.ct_count_user = data.count_user
          this.ct_goods_amount = data.goods_amount
          this.ct_total_commission = data.total_commission
          this.ct_user_list = data.user_list
          console.log(data)
        } else {
          console.error('获取数据失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.error(response)
      })
      // 分销商接口
      this.$http.get('user_union.php')
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.count_user = data.count_user
          this.goods_amount = data.goods_amount
          this.user_list = data.user_list
          console.log(data)
        } else {
          console.error('获取数据失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.error(response)
      })
    },
    tabChange () {
      $(function() {
        $('.weui-navbar__item').on('click', function () {
          $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on')
        })
      })
    }
  },
  activated () {
    this.dataPicker()
    this.loadClients()
    this.tabChange()
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
  border-radius:4px;
  cursor: pointer;
  flex:1;
  text-align: center;
}
.order-list_box .order-list_title .order_classify{
  background: #d6244f;
  color:#fff;
}
.time_filter{
  font-size:20px;
}
.order-list_box .order-list_title{
  padding:10px 0;
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
  box-shadow: 3px 3px 3px #aaa;
  padding: 20px;
  margin: 0 auto;
  width: 300px;
  position: relative;
  top: 30%;
  background: #fff;
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
</style>
