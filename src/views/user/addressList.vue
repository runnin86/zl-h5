<template>
<div>
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>收货地址管理</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{ name: 'Category',path: '/category'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <div class="address" style="margin-top:54px">
    <div class="row singleAddress" v-for="(address,itemIndex) in addList">
      <div>
        <p>
					{{address.consignee}}
				</p>
        <p>
					{{address.province}}-{{address.city}}-{{address.district}}
				</p>
        <p>
					{{address.address}}
				</p>
        <p>
					{{address.mobile}}
				</p>
        <div class="row">
          <div class="col-xs-6" :class="address.lastUse === 1 ? 'setDefault redColor' : ''" @click="setDefaultAdd(address.id)">
              <i class="iconfont-yzg icon-yzg-xuanzhong"></i> 设为默认地址
          </div>
          <div class="col-xs-6">
  					<a @click="edit(address.address_id)">
  						<i class="iconfont-yzg icon-yzg-bianji"></i> 编辑&nbsp; &nbsp; &nbsp;
  					</a>
            <a @click="deleteAddress(address.address_id)">
              <i class="iconfont-yzg icon-yzg-shanchu1"></i> 删除
            </a>
          </div>
				</div>
      </div>
      <table v-if="editState === address.address_id">
        <tr>
          <td>配送区域：</td>
          <td>
            <!-- <span class="form-control districtSel" @click="showCityPicker(itemIndex)">
							{{address.province_name}}-{{address.city_name}}-{{address.district_name}}
						</span> -->
            <wv-city-picker title="居住地址" :location="location" @get-val="addressPick"></wv-city-picker>
          </td>
        </tr>
        <tr>
          <td>详细地址：</td>
          <td>
						<input type="text" class="form-control" v-model="address.address"/>
					</td>
        </tr>
        <tr>
          <td>收 货 人：</td>
          <td>
						<input type="text" class="form-control" v-model="address.consignee"/>
					</td>
        </tr>
        <tr>
          <td>身份证号：</td>
          <td>
            <input type="text" class="form-control" v-model="address.idcard"/>
          </td>
        </tr>
        <tr>
          <td>电　　话：</td>
          <td>
						<input type="tel" class="form-control" placeholder="请填写联系电话" v-model="address.mobile"/>
					</td>
        </tr>
        <tr>
          <td colspan="2" class="saveAdd">
            <input type="button" class="form-control redAllBorCol" value="保存" @click="saveAddress(address.address_id)"/>
            <input type="button" class="form-control redAllBorCol" value="取消" @click="cancelAdd(address.address_id)" />
          </td>
        </tr>
      </table>
    </div>
    <router-link :to="{path:'/userCenter/addressList/newAddress'}">
      <a href="javascript:void(0);" class="btn redBgColor" style="display:block; border-radius:0">新增收货地址</a>
    </router-link>
  </div>
  <div class="loading" v-if = "load">
    <i class="weui-loading"></i>
  </div>
</div>
</template>

<script>
import weui from 'weui.js'
import $ from 'zepto'
import qs from 'qs'

export default {
  data() {
    return {
      editState: '0',
      defaultAddId: '',
      addList: [],
      savePreAdd: [], // 保存原始地址
      editIndex: '',
      load: true,  // 是否显示加载动画
      location: {
        id: '130000 130600 130630',
        name: '河北省 保定市 涞源县'
      }
    }
  },
  activated() {
    // 页面激活去获取地址数据
    this.loadAddressList()
  },
  methods: {
    /* 地址选择控件 */
    addressPick(name, code) {
      name = name.split(' ')
      this.addList[this.editIndex].province_name = name[0]
      this.addList[this.editIndex].city_name = name[1]
      this.addList[this.editIndex].district_name = name[2]
    },
    /*
     * 获取地址数据
    */
    loadAddressList() {
      this.$http.get('/user/addressList', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        // console.log(data)
        if (code === 1) {
          this.addList = data.addressList
        } else {
          $.toast(msg, 'forbidden')
        }
        this.load = false
      }, (response) => {
        this.load = false
        console.log(response)
      })
    },
    /*
    * 判断选择的是哪个地址
    */
    edit(indexObj) {
      this.editState = indexObj
      // 保存原有地址 取消修改时使用
      this.savePreAdd['consignee'] = this.addList[this.editIndex].consignee
      this.savePreAdd['address'] = this.addList[this.editIndex].address
      this.savePreAdd['mobile'] = this.addList[this.editIndex].mobile
      this.savePreAdd['province_name'] = this.addList[this.editIndex].province_name
      this.savePreAdd['city_name'] = this.addList[this.editIndex].city_name
      this.savePreAdd['district_name'] = this.addList[this.editIndex].district_name
      this.location.name = this.addList[this.editIndex].province_name + ' ' + this.addList[this.editIndex].city_name + ' ' + this.addList[this.editIndex].district_name
    },
    /*
    * 取消修改
    */
    cancelAdd(indexObj) {
      this.editState = '-1'
      // 地址赋值为原始保存地址 取消修改
      this.addList[this.editIndex].consignee = this.savePreAdd['consignee']
      this.addList[this.editIndex].address = this.savePreAdd['address']
      this.addList[this.editIndex].mobile = this.savePreAdd['mobile']
      this.addList[this.editIndex].province_name = this.savePreAdd['province_name']
      this.addList[this.editIndex].city_name = this.savePreAdd['city_name']
      this.addList[this.editIndex].district_name = this.savePreAdd['district_name']
    },
    /*
    * 删除地址
    */
    deleteAddress(indexObj) {
      if (confirm('确定要删除当前收货地址吗')) {
        let _this = this
        this.$http.get('user.php?act=drop_consignee', {
          params: {
            id: indexObj
          }
        })
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            _this.addList.splice(_this.editIndex, 1)
            _this.editState = '-1'
            weui.toast('删除成功', 1000)
            if (data.address_id !== null) {
              _this.defaultAddId = data.address_id    // 如果删除的是默认地址 则重新设置默认地址
            }
          } else {
            weui.toast('删除地址失败', 1000)
          }
        })
        .catch(function(error) {
          console.log('catch' + error)
        })
      }
    },
    /*
    * 地址保存
    */
    saveAddress(indexObj) {
      let pcdAdd = ''
      let address = ''
      let consignee = ''
      let mobile = ''
      let idcard = ''
      let validResult = ''
      if (indexObj !== 'add') {
        let nowEditAdd = this.addList[this.editIndex]
        validResult = this.dataValid(nowEditAdd.consignee, nowEditAdd.province_name, nowEditAdd.address, nowEditAdd.mobile, nowEditAdd.idcard)
        this.checkIdcard(nowEditAdd.idcard)
        if (validResult && this.errorMsg === '1') {
          pcdAdd = nowEditAdd.province_name + '-' + nowEditAdd.city_name + '-' + nowEditAdd.district_name
          address = nowEditAdd.address
          consignee = nowEditAdd.consignee
          mobile = nowEditAdd.mobile
          idcard = nowEditAdd.idcard
        }
      } else {
      }
      if (validResult && this.errorMsg === '1') {
        let _this = this
        let saveParam = {
          pcd: pcdAdd,
          address: address,
          consignee: consignee,
          mobile: mobile,
          submit: '保存',
          act: 'act_edit_address',
          address_id: indexObj,
          idcard: idcard
        }
        this.$http.post('user.php', qs.stringify(saveParam))
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            _this.editState = '-1'
            weui.toast('更新地址成功', 1000)
            // console.log(data)
          } else {
            weui.toast('更新地址失败', 1000)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      }
    },
    /*
    * 设置默认地址
    */
    setDefaultAdd(obj) {
      let _this = this
      let defAddParam = {
        address_id: obj
      }
      this.$http.post('default_address.php', qs.stringify(defAddParam))
      .then(function({data: {data, errcode, msg}}) {
        if (errcode === 0) {
          weui.toast('默认地址已更改', 1000)
          _this.defaultAddId = obj
        } else {
          weui.toast('默认地址更改失败', 1000)
        }
      })
      .catch(function(error) {
        console.log(error)
      })
    },
    /*
    * 地址填写验证
    */
    dataValid (consignee, region, address, mobile, idcard) {
      if (consignee === '' || region === '' || address === '' || mobile === '' || idcard === '') {
        weui.alert('请填写完整收货信息')
        return false
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
        weui.alert('手机号码填写不正确')
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
  }
}
</script>

<style scoped>
body {
  padding-bottom: 60px;
}

.address>div {
  background: #fff;
  padding: 15px 15px 0 15px; border-bottom:10px solid #f1f1f1;
}

.address .col-xs-6 {
  border-top: 1px solid #eee;
  line-height: 40px;
  height: 40px
}
.address .col-xs-6:last-child { text-align:right; }
.singleAddress {
  margin-top: 10px;
}

.singleAddress p {
  line-height: 30px;
  height: 30px;
}

.singleAddress .col-xs-6 {
  border-bottom: 10px solid #f8f8f8;
  height: 50px;
  line-height: 40px;
  cursor: pointer;
}

.singleAddress a {
  color: #555;
}
.singleAddress table {
  margin-top: 10px;
  width: 100%;
}

.singleAddress table td {
  padding: 5px;
}

.singleAddress table td:first-child {
  width: 90px;
  padding-left: 15px;
}

.singleAddress table td:last-child {
  padding-right: 50px
}

.singleAddress table .saveAdd {
  text-align: center;
  padding-bottom: 10px;
}

.saveAdd input {
  display: inline-block;
  width: 80px;
  margin: 0 10px;
  cursor: pointer;
}

.address .loginBtn {
  height: 40px;
  line-height: 30px;
  color: #fff;
}

.districtSel {
  overflow: hidden;
  line-height: 24px
}

</style>
