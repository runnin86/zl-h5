<template>
	<div>
		<div class="row nav-center">
		    <div class="col-xs-2 backBtn">
		      	<a href="javascript:history.back(-1)">
					<i class="iconfont-yzg icon-yzg-back"></i>
				</a>
		    </div>
		    <div class="col-xs-8 loginTitle">绑定银行卡</div>
		    <div class="col-xs-2"></div>
		</div>
		<div class="withDraw row">
			<table>
				<tr>
					<td>银行：</td>
					<td>
						<select class="form-control" v-model="userAccount.card_bank">
							<option v-for="bank in bankList" :value="bank">{{bank}}</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>银行卡号：</td>
					<td><input class="form-control" v-model="userAccount.account_number" placeholder="请填写银行卡号" /></td>
				</tr>
				<tr>
					<td>持卡人：</td>
					<td><input class="form-control" v-model="userAccount.real_name" placeholder="请填写持卡人姓名" /></td>
				</tr>
				<tr>
					<td>身份证号：</td>
					<td><input class="form-control" v-model="userAccount.identity_code" placeholder="请填写身份证号" /></td>
				</tr>
			</table>
			<a @click="binkBank()" class="rightCash">立即绑定</a>
		</div>
	</div>	
</template>

<script>
import md5 from 'md5'
import qs from 'qs'
import weui from 'weui.js'
export default {
  activated () {
    this.loadIncome()
  },
  data() {
    return {
      bankList: '',  // 获取银行列表
      userAccount: ''  // 用户账号信息
    }
  },
  methods: {
    /*
    *获取开户银行列表及用户账号信息
    */
    loadIncome() {
      let timestamp = Date.parse(new Date()) / 1000
      let md5Str = md5('5' + timestamp + 'NhH$ApI')
      let binkParam = {
        timestamp: timestamp,
        sign: md5Str,
        uid: 5,
        type: 3
      }
      this.$http.post('lncome_union.php', qs.stringify(binkParam))
      .then(function({data: {data, errcode, msg}}) {
        if (errcode === 0) {
          this.bankList = data.card_bank
          this.userAccount = data.user_account
          console.log(data)
        } else {
          console.log('fe' + msg)
          // weui.alert('请填写完整信息')
        }
      }.bind(this))
      .catch(function(error) {
        console.log(error)
      })
    },
    /*
    * 绑定银行卡
    */
    binkBank() {
      if (this.isIdno(this.userAccount.account_number, this.userAccount.card_bank, this.userAccount.identity_code, this.userAccount.real_name)) {
        let timestamp = Date.parse(new Date()) / 1000
        let md5Str = md5('5' + timestamp + 'NhH$ApI')
        let binkParam = {
          timestamp: timestamp,
          sign: md5Str,
          uid: 5,
          act: 'is_ajax',
          type: 3,
          account_number: this.userAccount.account_number,
          card_bank: this.userAccount.card_bank,
          identity_code: this.userAccount.identity_code,
          real_name: this.userAccount.real_name
        }
        this.$http.post('lncome_union.php', qs.stringify(binkParam))
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            console.log(data)
            weui.confirm('信息已修改，返回上一页', () => {
              history.go(-1)
            }, () => {
              //
            })
            // history.go(-1)
          } else {
            console.log('fe' + msg)
            weui.alert(msg)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      }
    },
    /*
    *输入验证
    */
    isIdno(cardNumber, bankName, idCard, cardHolder) {
      var valid = /(^\d{16}$)|(^\d{18}$)/
      if (bankName === '') {
        weui.alert('请填写开户银行')
        return false
      }
      if (cardNumber === '') {
        weui.alert('请填写银行卡号')
        return false
      }
      if (cardHolder === '') {
        weui.alert('请填写持卡人姓名')
        return false
      }
      if (!valid.test(idCard)) {
        weui.alert('身份证号填写不规范')
        return false
      }
      return true
    }
  }
}
</script>

<style>
  a{ cursor: pointer; }
	.withDraw{ margin-top:50px;  background: #fff; padding:10px;}
	.withDraw table{ width:100%;}
	.withDraw table td{ padding:7px 5px; }
	.withDraw table td:first-child{ width:80px; text-align: right; padding-right:5px; }
	.rightCash{ display:block; background: #d6244f; width:100px; height:36px; line-height: 36px; color:#fff; margin:0 auto; text-align: center; border-radius:4px; margin-top:18px;}
	.rightCash:hover, .rightCash:active, .rightCash:visited, .rightCash:link{ color:#fff; }
</style>
