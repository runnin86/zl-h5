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
			<table v-if="userInfo">
				<tr>
					<td>银行：</td>
					<td>
						<select class="form-control" value="" v-model="userInfo.bankCode">
							<option v-for="bank in bankList" :value="bank.code">{{bank.name}}</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>银行卡号：</td>
					<td><input class="form-control" v-model="userInfo.bankCard" placeholder="请填写银行卡号" /></td>
				</tr>
				<tr>
					<td>持卡人：</td>
					<td><input class="form-control" v-model="userInfo.bankAccountName" placeholder="请填写持卡人姓名" /></td>
				</tr>
				<tr>
					<td>身份证号：</td>
					<td><input class="form-control" v-model="userInfo.idCardNo" placeholder="请填写身份证号" /></td>
				</tr>
			</table>
			<a @click="binkBank()" class="rightCash">立即绑定</a>
		</div>
	</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import weui from 'weui.js'

export default {
  activated () {
    this.loadBank()
    this.userInfo = JSON.parse(window.localStorage.getItem('zlUser'))
  },
  data() {
    return {
      userInfo: null,
      bankList: null  // 获取银行列表
    }
  },
  methods: {
    /*
     * 查询用户地址信息
     */
    loadBank() {
      this.$http.get('/user/bankList', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        // console.log(data)
        if (code === 1) {
          this.bankList = data
        } else {
          $.toast(msg, 'forbidden')
        }
      }, (response) => {
        console.log(response)
      })
    },
    /*
    * 绑定银行卡
    */
    binkBank() {
      let bCode = this.userInfo.bankCode
      let card = this.userInfo.bankCard
      let name = this.userInfo.bankAccountName
      let idCardNo = this.userInfo.idCardNo
      if (this.isIdno(bCode, card, name, idCardNo)) {
        let zhis = this
        let binkParam = {
          'code': bCode,
          'card': card,
          'name': name,
          'idCardNo': idCardNo,
          'type': 'bank'
        }
        this.$http.post('user/bindInfo', qs.stringify(binkParam), {
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        })
        .then(function({data: {data, code, msg}}) {
          if (code === 0) {
            // 没有缓存强制
            let winUserNhh = JSON.parse(window.localStorage.getItem('zlUser'))
            winUserNhh['bankCode'] = bCode
            winUserNhh['bankAccountName'] = name
            winUserNhh['bankCard'] = card
            winUserNhh['idCardNo'] = idCardNo
            window.localStorage.setItem('zlUser', JSON.stringify(winUserNhh))
            // 提示和跳转
            weui.toast('绑定成功')
            setTimeout(() => {
              zhis.$parent.back()
            }, 2500)
          } else {
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
    isIdno(code, cardNumber, name, idCard) {
      if (!code) {
        weui.alert('请选择银行')
        return false
      }
      if (!cardNumber) {
        weui.alert('请填写银行卡号')
        return false
      }
      if (!name) {
        weui.alert('请填写持卡人姓名')
        return false
      }
      if (this.checkIdcard(idCard) !== '1') {
        return false
      }
      return true
    },
    /*
    * 身份证号码验证
    */
    checkIdcard(idcard) {
      var str_l = idcard.substr(idcard.length - 1, 1)
      var Y, JYM
      if (str_l === 'x') {
        idcard = idcard.replace('x', 'X')
      }
      var Errors = [
        '1',
        '身份证号码位数不对!',
        '身份证号码出生日期超出范围或含有非法字符!',
        '身份证号码校验错误!',
        '身份证地区非法!'
      ]
      var area = {11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'}
      var S, M, ereg
      var idcard_array = []
      idcard_array = idcard.split('')
      // 地区检验
      if (area[parseInt(idcard.substr(0, 2))] === null) {
        // return Errors[4]
        weui.alert(Errors[4])
        this.errorMsg = Errors[4]
      }
      // 身份号码位数及格式检验
      switch (idcard.length) {
        case 15:
          if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/   // 测试出生日期的合法性
          } else {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/   // 测试出生日期的合法性
          }
          if (ereg.test(idcard)) {
            return Errors[0]
          } else {
            // return Errors[2]
            weui.alert(Errors[2])
          }
          break
        case 18:
          // 18位身份号码检测
          // 出生日期的合法性检查
          // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
          // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
          if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/  // 闰年出生日期的合法性正则表达式
          } else {
            ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/   // 平年出生日期的合法性正则表达式
          }
          if (ereg.test(idcard)) {
            // 测试出生日期的合法性
            // 计算校验位
            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3
            Y = S % 11
            M = 'F'
            JYM = '10X98765432'
            M = JYM.substr(Y, 1) // 判断校验位
            if (M === idcard_array[17]) {
              return Errors[0] // 检测ID的校验位
              // this.errorMsg = Errors[0]
            } else {
              // return Errors[3]
              weui.alert(Errors[3])
            }
          } else {
            // return Errors[2]
            weui.alert(Errors[2])
          }
          break
        case 8:
          if (idcard) {
            return Errors[0]
          }
          break
        default:
          // return Errors[1]
          break
      }
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
