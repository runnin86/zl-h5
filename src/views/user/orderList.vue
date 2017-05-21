<template>
	<div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>购物订单列表</span>
      </div>
      <div class="col-xs-2 shop-bag">
        <router-link :to="{ name: 'Index',path: '/index' }">
          <span class="iconfont-yzg icon-yzg-goods"></span>
        </router-link>
      </div>
    </div>
		<div class="weui_tab orderTitle row"  id="orderTab"
		  style="height:44px;top:44px;margin-bottom:44px;z-index:0;">
				<div class="weui_navbar" style="height:44px; border-top:1px solid #ddd; background:#f4f4f4">
						<div class="weui_navbar_item" @click="orderType('order_all')"
						  :class="orderAct === 'order_all' ? 'tab-green' : ''">
								全部订单
						</div>
						<div class="weui_navbar_item" @click="orderType('order_unpay')"
						  :class="orderAct === 'order_unpay' ? 'tab-green' : ''">
								待付款
						</div>
						<div class="weui_navbar_item" @click="orderType('order_payed')"
						  :class="orderAct === 'order_payed' ? 'tab-green' : ''">
								待发货
						</div>
						<div class="weui_navbar_item" @click="orderType('order_done')"
						  :class="orderAct === 'order_done' ? 'tab-green' : ''">
								待收货
						</div>
						<div class="weui_navbar_item" @click="orderType('order_cancel')"
						  :class="orderAct === 'order_cancel' ? 'tab-green' : ''">
								已取消
						</div>
				</div>
		</div>
    <div class="row orderDisplay">
    	<ul v-infinite-scroll="queryList"
        infinite-scroll-immediate-check="false"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="30">
    		<li v-for="order in orderList">
    			<table>
    				<tr>
    					<td colspan="3" class="stateTitle">订单状态：{{order.order_status}}</td>
    				</tr>
    				<tr>
    					<td style="width:80px">
    						<img :src="order.master_img">
    					</td>
    					<td class="orderCode">
                <router-link :to="{path:'/shopOrdDet', query:{orderId: order.order_id}}">
      						<p>
                    <span>订单编号：</span>{{order.order_sn}}
                  </p>
      						<p>
                    <span>订单金额：</span>{{order.total_fee}}
                  </p>
      						<p>
                    <span>订单日期：</span>{{order.order_time}}
                  </p>
                </router-link>
    					</td>
    					<td style="width:30px">
    						<i class="iconfont-yzg icon-yzg-arrow"></i>
    					</td>
    				</tr>
    			</table>
    		</li>
    	</ul>
    </div>
    <div class="weui-loadmore" v-if="showLoading&&pagenum>-1">
      <i class="weui-loading"></i>
      <span class="weui-loadmore__tips">正在加载</span>
    </div>
    <div class="weui-loadmore weui-loadmore_line" v-if="pagenum===-1">
      <span class="weui-loadmore__tips">暂无更多数据</span>
    </div>
	</div>
</template>

<script>
import weui from 'weui.js'
import qs from 'qs'
// import $ from 'zepto'

export default {
  data () {
    return {
      orderList: [],
      orderAct: 'order_all',  // 购物订单类型 默认为全部订单
      pagenum: 0,
      showLoading: false,
      busy: true
    }
  },
  mounted () {
    // this.queryList()
  },
  activated() {
    if (this.$route.params.orderAct) {
      this.orderAct = this.$route.params.orderAct
      this.orderList = []
      this.pagenum = 0
    }
    if (this.$parent.fromPath !== '/shopOrdDet' || this.orderList.length === 0) {
      this.queryList()
    }
    // $('#orderTab').tab({defaultIndex: 0, activeClass: 'tab-green'})
  },
  methods: {
    orderType (oType) {
      this.$route.params.orderAct = false
      this.orderAct = oType
      this.orderList = []
      this.pagenum = 0
      this.queryList()
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
      // 请求参数列表
      let orderParam = {
        act: 'order_list',
        page: this.pagenum,
        order_action: this.orderAct
      }
      this.$http.post('user.php', qs.stringify(orderParam))
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // this.orderList = data.orders //不能赋值
          if (data.orders.length === 0 || data.pager.page_count < this.pagenum) {
            // 返回数据长度为0时,设置页码为-1
            this.pagenum = -1
            return
          }
          for (let m of data.orders) {
            this.orderList.push(m)
          }
        } else {
          weui.toast(msg, 2000)
        }
        this.busy = this.showLoading = false
      }, (response) => {
        // error callback
        weui.toast(response, 2000)
      })
    }
  }
}
</script>

<style scoped>
	.orderTitle .col-xs-2{ width:20%; margin-top:44px; text-align: center; height:40px; line-height: 40px; background: #fcfcfc; position:relative; padding:0; cursor: pointer;}
	.orderTitle .col-xs-2:before{ position:absolute; content: ""; width:1px; height:24px; right:0; top:8px; background: #eee }
	.orderTitle .col-xs-2:last-child:before{ background: #fcfcfc }
  .orderDisplay{ background: #eee }
	.orderDisplay li{ margin-top:10px; }
	.orderDisplay table{ width:100%; border-collapse: collapse; text-align: left}
	.orderDisplay table td{ background: #fcfcfc; padding:8px; }
	.orderDisplay table img{ width:80px; height:80px;}
	.orderDisplay table .stateTitle{ background: #fff;color:#999; padding:10px;  border-bottom:1px solid #eee; }
	.orderDisplay table td .icon-yzg-arrow{ font-size: 20px }
  .orderDisplay table .orderCode{ padding:0; line-height: 22px }
	.orderCode span{ color:#999; }
</style>
