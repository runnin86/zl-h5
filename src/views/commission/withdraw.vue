<template>
	<div>
		<div class="row nav-center">
		    <div class="col-xs-2 backBtn">
		      	<a href="javascript:history.back(-1)">
					<i class="iconfont-yzg icon-yzg-back"></i>
				</a>
		    </div>
		    <div class="col-xs-8 loginTitle">提现</div>
		    <div class="col-xs-2"></div>
		</div>
		<div class="withDraw row">
			<table>
				<tr>
					<td>可提现金额</td>
					<td>￥{{totalMoney}}</td>
				</tr>
				<tr>
					<td>本次提现</td>
					<td>
						<input class="form-control" v-model="nowMoney"
						  type="number" placeholder="单笔最高2万" />
					</td>
				</tr>
				<tr>
					<td>提现账户</td>
					<td>
						<select class="form-control">
							<option value="0">请选择提现账户</option>
							<option value="1">银行卡提现</option>
							<option value="2">支付宝提现</option>
							<option value="3">微信提现</option>
						</select>
					</td>
				</tr>
			</table>
			<a :disabled="nowMoney>0" class="rightCash">立即提现</a>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      totalMoney: 0,
      nowMoney: 0,
      commiAccount: []
    }
  }
}
</script>

<style>
	.withDraw{ margin-top:50px;  background: #fff; padding:10px;}
	.withDraw table{ width:100%;}
	.withDraw table td{ padding:7px 5px; }
	.withDraw table td:first-child{ width:80px; text-align: right; padding-right:5px; }
	.rightCash{ display:block; background: #d6244f; width:140px; height:36px; line-height: 36px; color:#fff; margin:0 auto; text-align: center; border-radius:4px; margin-top:18px;}
</style>
