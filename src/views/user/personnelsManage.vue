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
      <div class="col-xs-2" id="showDatePicker" @click="datePicker(judge)">
        <span class="iconfont-yzg icon-yzg-shijianshezhianniux icon-ajust-css"></span>
      </div>
    </div> 
    <div class="row">
      <div class="order-list_box">
        <div class="order-list_title">
          <span @click="toggleOrder(true)" :class="judge ? 'redBgColor' : '' ">我的分销商</span>
          <span @click="toggleOrder(false)"  :class="judge ? '' : 'redBgColor' ">我的客户</span>
        </div>
        <div class="order-list_content"
          v-infinite-scroll="queryList"
          infinite-scroll-immediate-check="false"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="30"
        >
          <!-- 我的分销商 -->
          <div class="self-order_list" v-if="judge">
            <div class="sell_amount">
              <div class="members">
                <span>共计：</span>
                <span>{{count_user_distributer}}人</span>
              </div>
              <div class="amount">
                <span>团队销售额</span>
                <span class="number" v-text="goods_amount_distributer"></span>
              </div>
            </div>
            <div class="list_items">
              <table class="table">
                <thead>
                  <tr>
                    <th>成员</th>
                    <th>订单数</th>
                    <th @click="arrowDirect($event)">
                      <span>销售额</span>
                      <span class="iconfont-yzg icon-yzg-paixu" :class="classObject" ></span></th>
                    <th @click="arrowDirect($event)">
                      <span>我的佣金</span>
                      <span class="iconfont-yzg icon-yzg-paixu" :class="classObject2"></span>
                    </th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody  v-if="user_list_distributer.length !== 0">
                  <tr v-for="uld in user_list_distributer">
                    <td>
                      <span class="service_provider_name" v-if="uld.remark">{{uld.remark}}</span>
                      <span class="service_provider_name" v-else-if="uld.nickname">{{uld.nickname}}</span>
                      <span class="service_provider_name" v-else="uld.user_name">{{uld.user_name}}</span>
                      <span class="service_provider" v-if="uld.user_rank === '1'">(服务商)</span>
                      <span class="service_provider" v-else-if="uld.user_rank === '2'">(合伙人)</span>
                      <span class="service_provider" v-else-if="uld.user_rank === '3'">(白金合伙人)</span>
                      <span class="service_provider" v-else-if="uld.user_rank === '4'">(董事)</span>
                    </td>
                    <td v-if="uld.order_count">{{uld.order_count}}</td>
                    <td v-else>0</td>
                    <td v-if="uld.amount_count">￥{{uld.amount_count}}</td>
                    <td v-else>￥0.00</td>
                    <td v-if="uld.commission">￥{{uld.commission}}</td>
                    <td v-else>￥0.00</td>
                    <td @click = "remark(uld.seller_id, $event)">
                      <span class="iconfont-yzg icon-yzg-beizhu"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 我的客户 -->
          <div class="team-order_list" v-else>
            <div class="sell_amount">
              <div class="members">
                <span>共计：</span>
                <span v-text="count_user_client">人</span>
              </div>
              <div class="buy_amount">
                <span>累计购物额:</span>
                <span>￥{{goods_amount_client}}</span>
              </div>
              <div class="amount">
                <span>获得佣金</span>
                <span class="number" v-text="total_commission_client"></span>
              </div>
            </div>
            <div class="list_items">
              <table class="table">
                <thead>
                  <tr>
                    <th>成员</th>
                    <th>购物订单数</th>
                    <th @click="arrowDirect($event)">
                      <span>购物金额</span>
                      <span class="iconfont-yzg icon-yzg-paixu" :class="classObject3"></span>
                    </th>
                    <th @click="arrowDirect($event)">
                      <span>我的佣金</span>
                      <span class="iconfont-yzg icon-yzg-paixu" :class="classObject2"></span>
                    </th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ct in user_list_client">
                    <td>
                      <span class="service_provider_name" v-if="ct.remark">{{ct.remark}}</span>
                      <span class="service_provider_name" v-else-if="ct.nickname">{{ct.nickname}}</span>
                      <span class="service_provider_name" v-else="ct.user_name">{{ct.user_name}}</span>
                    </td>
                    <td>{{ct.order_count}}</td>
                    <td>￥{{ct.amount_count}}</td>
                    <td>￥{{ct.commission}}</td>
                    <td @click = "remark(ct.seller_id, $event)">
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
         v-model="uldRemark"/>
        <a href="javascript:;void(0)" @click="save()" class="btn btn-danger btn-xg">确认修改</a>
        <a class="bz-close" href="javascript:void(0);">&times;</a>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'

export default{
  data () {
    return {
      user_distributer_data: null,
      user_client_data: null,
      judge: true,
      count_user_distributer: 0,
      goods_amount_distributer: 0,
      user_list_distributer: [],
      count_user_client: 0,
      goods_amount_client: 0,
      total_commission_client: 0,
      user_list_client: [],
      uldRemark: '',
      currentId: '',
      indexNum: 0,
      pagenum: 0,
      showLoading: false,
      busy: true,
      a_up: false,
      a_down: false,
      diff: '',
      diff_commission: true,
      sort: 'amount_count'
    }
  },
  // 排序
  computed: {
    classObject () {
      return {
        arrow_up: this.a_up && this.diff === '销售额',
        arrow_down: this.a_down && this.diff === '销售额'
      }
    },
    classObject2 () {
      return {
        arrow_up: this.a_up && this.diff === '我的佣金' && this.diff_commission,
        arrow_down: this.a_down && this.diff === '我的佣金' && this.diff_commission
      }
    },
    classObject3 () {
      return {
        arrow_up: this.a_up && this.diff === '购物金额',
        arrow_down: this.a_down && this.diff === '购物金额'
      }
    }
  },
  methods: {
    arrowDirect (event) {
      let $ev = $(event.currentTarget)
      let text = $ev.children('span:first-child').text()
      text === '销售额' ? this.diff = '销售额' : text === '我的佣金' ? this.diff = '我的佣金' : this.diff = '购物金额'
      this.a_up === false ? (this.a_up = true, this.a_down = false) : (this.a_down = true, this.a_up = false)
      if (this.judge) {
        this.diff_commission = this.judge
      } else {
        this.diff_commission = !this.judge
      }
      if (this.a_up === true && this.judge === false) {
        this.pagenum = 0
        this.user_list_client = []
        this.queryList()
      }
      if (this.a_up === false && this.judge === false) {
        this.pagenum = 0
        this.user_list_client = []
        this.queryList()
      }
      if (this.a_up === true && this.judge === true) {
        this.pagenum = 0
        this.user_list_distributer = []
        this.queryList()
      }
      if (this.a_up === false && this.judge === true) {
        this.pagenum = 0
        this.user_list_distributer = []
        this.queryList()
      }
    },
    toggleOrder (judge) {
      this.judge = judge
      this.a_up = false
      this.a_down = false
      this.diff_commission = this.judge
      this.pagenum = 0
      this.user_list_distributer = []
      this.user_list_client = []
      this.queryList()
    },
    // 循环遍历获取当前对象的索引值
    eachData (userId, judge) {
      let _this = this
      let $ev = judge ? $(this.user_list_distributer) : $(this.user_list_client)
      $ev.forEach(function(item, index) {
        if ($ev[index].seller_id === userId) {
          _this.indexNum = index
        }
      })
    },
    save () {
      this.eachData(this.currentId, this.judge)
      $('.bz-tg').css('display', 'none')
      // 我的分销商备注接口
      let bz = {
        tuid: this.currentId,
        remark: this.uldRemark
      }
      if (this.judge) {
        this.$http.post('/user_union.php?act=remark', qs.stringify(bz))
        .then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            // console.log(data)
            this.user_list_distributer[this.indexNum].remark = this.uldRemark  // 备注赋值
            weui.alert('修改成功')
          } else {
            $.toast('非法修改', 'forbidden')
            console.error('获取数据失败:' + msg)
          }
        }, (response) => {
          // error callback
          console.error(response)
        })
      } else {
        this.$http.post('/client_union.php?act=remark', qs.stringify(bz))
        .then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            // console.log(data)
            this.user_list_client[this.indexNum].remark = this.uldRemark  // 备注赋值
            weui.alert('修改成功')
          } else {
            $.toast('非法修改', 'forbidden')
            console.error('获取数据失败:' + msg)
          }
        }, (response) => {
          // error callback
          console.error(response)
        })
      }
    },
    // 修改备注弹窗
    remark (id, event) {
      this.currentId = id
      let $ev = $(event.currentTarget)
      let org = $ev.parent().children('td:first-child').children('span:first-child').text()
      $('.bz-tg input').val('')
      $('.bz-tg').css('display', 'block')
      $('.bz-tg p').html('为 <span style="color:#d6244f">' + org + '</span> 设置备注')
      $('.bz-close').on('click', function() {
        $('.bz-tg').css('display', 'none')
      })
    },
    // 时间筛选器
    datePicker (judge) {
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
            if (_this.judge) {
              _this.user_list_distributer = _this.user_distributer_data.user_list_distributer
              for (let i = 0; i < _this.user_list_distributer.length; i++) {
                if (_this.user_list_distributer[i].add_time) {
                  if (_this.user_list_distributer[i].add_time.slice(0, 10) === results.join('-')) {
                    sx_self.push(_this.user_list_distributer[i])
                  }
                }
              }
              _this.user_list_distributer = sx_self
            } else {
              _this.user_list_client = _this.user_client_data.user_list_client
              for (let i = 0; i < _this.user_list_client.length; i++) {
                if (_this.user_list_client[i].add_time.slice(0, 10) === results.join('-')) {
                  sx_team.push(_this.user_list_client[i])
                }
              }
              console.log(sx_team)
              _this.user_list_client = sx_team
            }
          }
        })
      })
    },
    // 分销商和客户模块切换
    tabChange () {
      $(function() {
        $('.weui-navbar__item').on('click', function () {
          $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on')
        })
      })
    },
    sortNumber (a, b) {
      return a - b
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
      if (this.judge) {
        this.$http.get('/user_union.php')
        .then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            this.user_distributer_data = data
            this.count_user_distributer = data.count_user
            this.goods_amount_distributer = data.goods_amount
            this.page = data.page
            if (data.user_list_distributer === 0 || this.pagenum > data.page_count) {
              this.pagenum = -1
              return
            }
            if (this.a_up === true && this.a_down === false) {
              let arr_count = []
              let arr_user = []
              for (let m of data.user_list_distributer) {
                arr_count.push(m.amount_count)
              }
              arr_count.sort(this.sortNumber)
              for (let i = 0; i < arr_count.length;) {
                for (let j = 0; j < data.user_list_distributer.length; j++) {
                  if (arr_count[i] === data.user_list_distributer[j].amount_count) {
                    arr_user.push(data.user_list_distributer[j])
                    i++
                  }
                }
              }
              console.log(arr_user)
              this.user_list_distributer = arr_user.reverse()
            } else if (this.a_up === false && this.a_down === true) {
              let arr_count = []
              let arr_user = []
              for (let m of data.user_list_distributer) {
                arr_count.push(m.amount_count)
              }
              arr_count.sort(this.sortNumber)
              for (let i = 0; i < arr_count.length;) {
                for (let j = 0; j < data.user_list_distributer.length; j++) {
                  if (arr_count[i] === data.user_list_distributer[j].amount_count) {
                    arr_user.push(data.user_list_distributer[j])
                    i++
                  }
                }
              }
              this.user_list_distributer = arr_user
            } else {
              for (let m of data.user_list_distributer) {
                this.user_list_distributer.push(m)
              }
            }
            // console.log(data)
          } else {
            console.error('获取数据失败:' + msg)
          }
          this.busy = this.showLoading = false
        }, (response) => {
          // error callback
          console.log(response)
        })
      } else {
        this.$http.get('/client_union.php')
        .then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            this.user_client_data = data
            this.count_user_client = data.count_user
            this.goods_amount_client = data.goods_amount
            this.total_commission_client = data.total_commission
            if (data.user_list_client === 0 || this.pagenum > data.page_count) {
              this.pagenum = -1
              return
            }
            if (this.a_up === true && this.a_down === false) {
              let arr_count = []
              let arr_user = []
              for (let m of data.user_list_client) {
                arr_count.push(m.amount_count)
              }
              arr_count.sort(this.sortNumber)
              for (let i = 0; i < arr_count.length;) {
                for (let j = 0; j < data.user_list_client.length; j++) {
                  if (arr_count[i] === data.user_list_client[j].amount_count) {
                    arr_user.push(data.user_list_client[j])
                    i++
                  }
                }
              }
              this.user_list_client = arr_user.reverse()
            } else if (this.a_up === false && this.a_down === true) {
              let arr_count = []
              let arr_user = []
              for (let m of data.user_list_client) {
                arr_count.push(m.amount_count)
              }
              arr_count.sort(this.sortNumber)
              for (let i = 0; i < arr_count.length;) {
                for (let j = 0; j < data.user_list_client.length; j++) {
                  if (arr_count[i] === data.user_list_client[j].amount_count) {
                    arr_user.push(data.user_list_client[j])
                    i++
                  }
                }
              }
              this.user_list_client = arr_user
            } else {
              for (let m of data.user_list_client) {
                this.user_list_client.push(m)
              }
            }
            // console.log(data)
          } else {
            console.error('获取数据失败:' + msg)
          }
          this.busy = this.showLoading = false
        }, (response) => {
          // error callback
          console.log(response)
        })
      }
    }
  },
  activated () {
    this.pagenum = 0
    this.user_list_distributer = []
    this.user_list_client = []
    this.queryList()
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
