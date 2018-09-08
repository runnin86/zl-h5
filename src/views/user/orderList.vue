<template>
	<div>
		<div class="weui_tab orderTitle row"  id="orderTab"
		  style="height:44px;top:4px;z-index:0;">
				<div class="weui_navbar" style="height:44px; border-top:1px solid #ddd; background:#f4f4f4">
						<div class="weui_navbar_item" @click="orderType(-1)"
						  :class="orderAct === -1 ? 'tab-green' : ''">
								全部订单
						</div>
						<div class="weui_navbar_item" @click="orderType(0)"
						  :class="orderAct === 0 ? 'tab-green' : ''">
								待付款
						</div>
						<div class="weui_navbar_item" @click="orderType(1)"
						  :class="orderAct === 1 ? 'tab-green' : ''">
								待发货
						</div>
						<div class="weui_navbar_item" @click="orderType(2)"
						  :class="orderAct === 2 ? 'tab-green' : ''">
								待收货
						</div>
						<div class="weui_navbar_item" @click="orderType(4)"
						  :class="orderAct === 4 ? 'tab-green' : ''">
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
    					<td colspan="3" class="stateTitle">订单状态：{{order.orderStatus | orderStatusFilter}}</td>
    				</tr>
    				<tr>
    					<td style="width:80px">
    						<img :src="img_domain + order.img">
    					</td>
    					<td class="orderCode">
                <router-link :to="{path:'/shopOrdDet', query:{orderNo: order.orderNo}}">
      						<p>
                    <span>订单编号：</span>{{order.orderNo}}
                  </p>
      						<p>
                    <span>订单金额：</span>{{order.price}}
                  </p>
      						<p>
                    <span>订单日期：</span>{{order.orderDate / 1000 | dateFilter(4)}}
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
import $ from 'zepto'

export default {
  data () {
    return {
      img_domain: 'http://img.zulibuy.com/images/',
      orderList: [],
      orderAct: -1,  // 购物订单类型 默认为全部订单
      pagenum: 0,
      showLoading: false,
      busy: true
    }
  },
  mounted () {
    // this.queryList()
  },
  activated() {
    this.orderAct = this.$route.query.orderAct
    this.orderList = []
    this.pagenum = 0
    if (this.$parent.fromPath !== '/shopOrdDet' || this.orderList.length === 0) {
      this.queryList()
    }
    // $('#orderTab').tab({defaultIndex: 0, activeClass: 'tab-green'})
  },
  methods: {
    orderType (oType) {
      this.$route.query.orderAct = false
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
      this.$http.get('order/orderList', {
        params: {
          pageNum: this.pagenum,
          pageSize: 10,
          orderStatus: this.orderAct
        },
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        if (code === 1) {
          // console.log(data)
          if (data.length === 0) {
            // 返回数据长度为0时,设置页码为-1
            this.pagenum = -1
            return
          }
          for (let m of data) {
            this.orderList.push(m)
          }
        } else {
          $.toast(msg, 'forbidden')
        }
        this.busy = this.showLoading = false
      }, (response) => {
        // error callback
        console.error(response)
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
