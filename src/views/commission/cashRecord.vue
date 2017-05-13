<template>
	<div>
		<div class="row nav-center">
		    <div class="col-xs-2 backBtn">
		      	<a href="javascript:history.back(-1)">
					<i class="iconfont-yzg icon-yzg-back"></i>
				</a>
		    </div>
		    <div class="col-xs-8 loginTitle">提现记录</div>
		    <div class="col-xs-2"></div>
		</div>
		<div class="cashRecord row">
			<div class="col-xs-6">
				<p>合计提现次数</p>
				<span>18</span>次
			</div>
			<div class="col-xs-6">
				<p>合计提现金额</p>
				<span>￥8629.75</span>
			</div>
		</div>
		<div class="row recordDet">
			<table>
				<tr>
					<th>2017年3月</th>
					<th>提现金额</th>
				</tr>
				<tr>
					<td>2017-03-06 20:08:09</td>
					<td>￥688</td>
				</tr>
				<tr>
					<td>2017-03-06 20:08:09</td>
					<td>￥688</td>
				</tr>
			</table>
		</div>
	</div>	
</template>

<script>
export default {
  data() {
    return {
      nowMoney: '',
      commiAccount: []
    }
  }
}
</script>

<style scoped>
	.cashRecord{ background: #fff; padding:54px 15px 15px; }
	.cashRecord .col-xs-6{ padding:10px; text-align: center }
	.cashRecord .col-xs-6 p{ line-height: 28px; padding-bottom:8px; }
	.cashRecord .col-xs-6 span{ font-size:18px; color:#d6244f; }
	.recordDet table{ width:100%; }
	.recordDet table td,.recordDet table th{ width:50%; text-align: center; height:30px; line-height: 
		30px}
	.recordDet table td{ padding:7px 5px; border-top:1px solid #f8f8f8; }
	.recordDet table th{ background: #f8f8f8 }
	.recordDet{ margin-top:10px; background: #fff }
</style>
