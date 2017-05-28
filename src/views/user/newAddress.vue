<template>
<div>
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>{{titleName}}</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{ name: 'Index',path: '/index'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <div class="row mainContent">
    <div class="receiverInfor">
      <div class="addressDetails">
        <table class="addFillIn">
          <tr>
            <td>*收 &nbsp;货 人：</td>
            <td>
              <input type="text" placeholder="请填写收货人信息" v-model="newAddName" class="form-control" />
            </td>
          </tr>
          <tr>
            <td>*省  市  区：</td>
            <td>
              <!-- <p @click="showCityPicker('newAddProvince')" class="choiceProv">{{newAddProvince}}</p> -->
              <wv-city-picker title="居住地址" :location="location" @get-val="addressPick"></wv-city-picker>
            </td>
          </tr>
          <tr>
            <td>*详细地址：</td>
            <td>
              <input type="text" placeholder="请填写详细地址" v-model="newAddDetail" class="form-control" />
            </td>
          </tr>
          <tr>
            <td>*身份证号：</td>
            <td>
              <input type="text" placeholder="请填写身份证号" v-model="idCard" class="form-control" />
            </td>
          </tr>
          <tr>
            <td>*手机号码：</td>
            <td>
              <input type="tel" placeholder="请填写收货人手机号码" v-model="newAddTel" class="form-control" />
            </td>
          </tr>
        </table>
        <div class="saveNew">
          <a @click="savenew" class="redBgColor">保存收货地址</a>
        </div>
      </div>
    </div>
    <!-- <span class="show" @click="showCityPicker('addressStr')">show address</span> -->
    <!-- <citys-picker :city="data" :init-value="defaultVal" @confirm="confirmCP" ref="address"></citys-picker> -->
    <!-- <p style="text-align: center;" @click="showCityPicker('addressStr')">{{addressStr}}</p> -->
  </div>
</div>
</template>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'
// import CitysPicker from 'vue-citys-picker'
// import CityData from '../../../static/json/citydata.json'
export default {
  // components: {
  //   CitysPicker
  // },
  activated() {
    this.$store.commit('CHANGE_IS_INDEX', false)
  },
  data() {
    return {
      titleName: '新增地址',  // title显示标题
      newAddName: '', // 新增收货人信息
      newAddProvince: '安徽省-芜湖市-三山区',
      newAddDetail: '',
      newAddTel: '',
      idCard: '',
      errorMsg: '',
      location: {
        id: '340000 340200 340208',
        name: '安徽省 芜湖市 三山区'
      }
    }
  },
  methods: {
    /* 地址选择 */
    addressPick(name, code) {
      name = name.split(' ')
      this.newAddProvince = name[0] + '-' + name[1] + '-' + name[2]
    },
    // 去除字符串空格
    removeSpace(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    savenew() {
      var _this = this
      var validResult = ''
      validResult = this.dataValid(this.newAddName, this.newAddProvince, this.newAddDetail, this.newAddTel)
      validResult ? this.checkIdcard(this.idCard) : ''
      if (validResult && this.errorMsg === '1') {
        let saveParam = {
          pcd: this.newAddProvince,
          address: this.newAddDetail,
          consignee: this.newAddName,
          mobile: this.newAddTel,
          submit: '保存',
          act: 'act_edit_address',
          address_id: '',
          idcard: this.idCard
        }
        this.$http.post('user.php', qs.stringify(saveParam))
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            weui.confirm('更新地址成功，继续添加?', () => {
              _this.newAddName = ''
              _this.newAddProvince = ''
              _this.newAddDetail = ''
              _this.newAddTel = ''
            }, () => {
              history.back()
            })
          } else {
            $.toast('更新地址失败', 'cancel')
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      }
    },
    /*
    * 地址填写验证
    */
    dataValid (consignee, region, address, mobile, idcard) {
      if (consignee === '' || region === '' || address === '' || mobile === '' || idcard === '') {
        $.toast('请填写完整收货信息', 'forbidden')
        return false
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
        $.toast('手机号码填写不正确', 'forbidden')
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
        console.log(Errors[4])
        weui.alert(Errors[4])
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
            // return Errors[0]
            console.log(Errors[0])
            this.errorMsg = Errors[0]
          } else {
            // return Errors[2]
            console.log(Errors[2])
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
              // return Errors[0] // 检测ID的校验位
              console.log(Errors[0])
              this.errorMsg = Errors[0]
            } else {
              // return Errors[3]
              console.log(Errors[3])
              weui.alert(Errors[3])
            }
          } else {
            // return Errors[2]
            console.log(Errors[2])
            weui.alert(Errors[2])
          }
          break
        default:
          // return Errors[1]
          console.log(Errors[1])
          weui.alert(Errors[1])
          break
      }
    }
  },
  created() { // 创建状态初始化
    // this.confirm(this.defaultVal)
  }
}
</script>


<style scoped>
@import '/static/style/orderfill.css';
/*@import '/static/style/vue-citys-picker.css';*/
body {
  /*background: #eee;*/
  color: #3a3a3a;
  font-size: 14px
}
.saveNew{ width:100px; height:38px; text-align: center; margin:30px auto 20px; border-radius:4px; cursor: pointer;}
.saveNew a{ color:#fff; display: block; height:38px; line-height: 38px; }
.addFillIn .cell_box{ width:80%; }
</style>
