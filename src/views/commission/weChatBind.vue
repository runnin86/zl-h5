<template>
	<div>
		<div class="row nav-center">
		    <div class="col-xs-2 backBtn">
		      	<a href="javascript:history.back(-1)">
					<i class="iconfont-yzg icon-yzg-back"></i>
				</a>
		    </div>
		    <div class="col-xs-8 loginTitle">微信绑定</div>
		    <div class="col-xs-2"></div>
		</div>
		<div class="withDraw row">
			<table>
				<tr>
					<td>身份证号</td>
					<td><input class="form-control" v-model="userAccount.identity_code" placeholder="请填写身份证号" /></td>
				</tr>
        <tr>
          <td>微信账号</td>
          <td><input class="form-control" v-model="userAccount.account_number" placeholder="请填写微信账号" /></td>
        </tr>
        <tr>
          <td>真实姓名</td>
          <td><input class="form-control" v-model="userAccount.real_name" placeholder="请填写微信账号" /></td>
        </tr>
			</table>
			<a @click="chatBind()" class="rightCash">立即绑定</a>
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
      userAccount: ''
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
        type: 2
      }
      this.$http.post('lncome_union.php', qs.stringify(binkParam))
      .then(function({data: {data, errcode, msg}}) {
        if (errcode === 0) {
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
    * 绑定微信
    */
    chatBind() {
      if (this.inputValid(this.userAccount.account_number, this.userAccount.real_name, this.userAccount.identity_code)) {
        let timestamp = Date.parse(new Date()) / 1000
        let md5Str = md5('5' + timestamp + 'NhH$ApI')
        let binkParam = {
          timestamp: timestamp,
          sign: md5Str,
          uid: 5,
          act: 'is_ajax',
          type: 2,
          account_number: this.userAccount.account_number,
          card_bank: '',
          identity_code: this.userAccount.identity_code,
          real_name: this.userAccount.real_name
        }
        this.$http.post('lncome_union.php', qs.stringify(binkParam))
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            console.log(data)
            weui.toast('绑定成功')
            // history.go(-1)
          } else {
            console.log('fe' + msg)
            weui.alert('请填写完整信息')
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
    inputValid(cardNumber, realName, idCard) {
      var valid = /(^\d{16}$)|(^\d{18}$)/
      if (realName === '') {
        weui.alert('真实姓名')
        return false
      }
      if (!valid.test(idCard)) {
        weui.alert('身份证号填写不规范')
        return false
      }
      if (cardNumber === '') {
        weui.alert('请填写微信账号')
        return false
      }
      return true
    }
  }
}
</script>

<style>
	.withDraw{ margin-top:50px;  background: #fff; padding:10px;}
	.withDraw table{ width:100%;}
	.withDraw table td{ padding:7px 5px; }
	.withDraw table td:first-child{ width:80px; text-align: right; padding-right:5px; }
	.rightCash{ display:block; background: #d6244f; width:100px; height:36px; line-height: 36px; color:#fff; margin:0 auto; text-align: center; border-radius:4px; margin-top:18px;}
</style>
