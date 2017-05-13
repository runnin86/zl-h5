<template>
<div>
  <div class="row nav-center">
    <div class="col-xs-2 backBtn">
      <a href="javascript:history.back(-1)">
				<i class="iconfont-yzg icon-yzg-back"></i>
			</a>
    </div>
    <div class="col-xs-8 loginTitle">收货地址管理</div>
    <div class="col-xs-2">
    </div>
  </div>
  <div class="address" style="margin-top:54px">
    <div class="row singleAddress" v-for="(address,itemIndex) in addList">
      <div>
        <p>
					{{address.consignee}}
				</p>
        <p>
					{{address.province_name}}-{{address.city_name}}-{{address.district_name}}
				</p>
        <p>
					{{address.mobile}}
				</p>
        <div class="row">
          <div class="col-xs-6" :class="defaultAddId === address.address_id ? 'setDefault' : ''" @click="setDefaultAdd(address.address_id)">
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
            <span class="form-control districtSel" @click="showCityPicker(itemIndex)">
							{{address.province_name}}-{{address.city_name}}-{{address.district_name}}
						</span>
          </td>
        </tr>
        <tr>
          <td>详细地址：</td>
          <td>
						<input type="text" class="form-control" placeholder="请填写详细地址" v-model="address.address"/>
					</td>
        </tr>
        <tr>
          <td>收 货 人：</td>
          <td>
						<input type="text" class="form-control" placeholder="请填写收货人姓名" v-model="address.consignee"/>
					</td>
        </tr>
        <tr>
          <td>电　　话：</td>
          <td>
						<input type="text" class="form-control" placeholder="请填写联系电话" v-model="address.mobile"/>
					</td>
        </tr>
        <tr>
          <td colspan="2" class="saveAdd">
            <input type="button" class="form-control" value="保存" @click="saveAddress(address.address_id)"/>
            <input type="button" class="form-control" value="取消" @click="cancelAdd(address.address_id)" />
          </td>
        </tr>
      </table>
    </div>
    <router-link :to="{path:'/userCenter/addressList/newAddress'}">
      <a href="javascript:void(0);" class="btn loginBtn" style="margin-bottom:30px">新增收货地址</a>
    </router-link>
  </div>
  <citys-picker :city="data" :init-value="defaultVal" @confirm="confirmCP" ref="address"></citys-picker>
</div>
</template>

<script>
import weui from 'weui.js'
import $ from 'zepto'
import qs from 'qs'
import CitysPicker from 'vue-citys-picker'
import CityData from '../../../static/json/citydata.json'

export default {
  components: {
    CitysPicker
  },
  data() {
    return {
      editState: '0',
      defaultAddId: '',
      addList: [],
      savePreAdd: [], // 保存原始地址
      editIndex: '',
      data: CityData, // 地区选择控件
      defaultVal: [{
        name: '安徽省',
        value: '340000'
      }, {
        name: '芜湖市',
        value: '340200'
      }, {
        name: '三山区',
        value: '340208'
      }],
      addressStr: null,
      pickedId: null
    }
  },
  activated() {
    // 页面激活去获取地址数据
    this.loadAddressList()
  },
  methods: {
    confirmCP(values) { // 地址选择
      if (this.editState !== 'addstate') { // 新加地址
        this.$set(this.addList[this.pickedId], 'province_name', values[0].name)
        this.$set(this.addList[this.pickedId], 'city_name', values[1].name)
        this.$set(this.addList[this.pickedId], 'district_name', values[2].name)
      } else { // 已存在地址改变数组内容
        this.$set(this.$data, this.pickedId, values[0].name + '-' + values[1].name + '-' + values[2].name)
      }
      this.pickedId = null
    },
    showCityPicker(id) { // 显示地址选择器
      this.pickedId = id
      this.$refs['address'].open()
    },
    /*
     * 获取地址数据
    */
    loadAddressList() {
      let postData = {
        act: 'address_list'
      }
      this.$http.post('user.php', qs.stringify(postData))
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          this.addList = data.consignee_list
          this.addressEach('deleteNull')
          this.addressEach('getDefault')
        } else {
          $.toast('获取地址失败，请刷新重试', 'forbidden')
        }
      }, (response) => {
        console.log(response)
      })
    },
    /*
    * 判断选择的是哪个地址
    */
    edit(indexObj) {
      this.editState = indexObj
      this.addressEach(indexObj)
      // 保存原有地址 取消修改时使用
      this.savePreAdd['consignee'] = this.addList[this.editIndex].consignee
      this.savePreAdd['address'] = this.addList[this.editIndex].address
      this.savePreAdd['mobile'] = this.addList[this.editIndex].mobile
      this.savePreAdd['province_name'] = this.addList[this.editIndex].province_name
      this.savePreAdd['city_name'] = this.addList[this.editIndex].city_name
      this.savePreAdd['district_name'] = this.addList[this.editIndex].district_name
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
        this.addressEach(indexObj)
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
      let validResult = ''
      if (indexObj !== 'add') {
        this.addressEach(indexObj)
        let nowEditAdd = this.addList[this.editIndex]
        validResult = this.dataValid(nowEditAdd.consignee, nowEditAdd.province_name, nowEditAdd.address, nowEditAdd.mobile)
        if (validResult) {
          pcdAdd = nowEditAdd.province_name + '-' + nowEditAdd.city_name + '-' + nowEditAdd.district_name
          address = nowEditAdd.address
          consignee = nowEditAdd.consignee
          mobile = nowEditAdd.mobile
        }
      } else {
      }
      if (validResult) {
        let _this = this
        let saveParam = {
          pcd: pcdAdd,
          address: address,
          consignee: consignee,
          mobile: mobile,
          submit: '保存',
          act: 'act_edit_address',
          address_id: indexObj
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
    * 寻找对应地址索引
    */
    addressEach(indexObj) {
      let _this = this
      this.addList.forEach(function(item, index) {
        if (indexObj === 'getDefault') {    // 寻找默认地址id
          if (item.last_use === '1') {
            _this.defaultAddId = item.address_id
            return
          }
        } else if (indexObj === 'deleteNull') { // 删除id为空的地址  暂时用///
          if (item.address_id === undefined) {
            _this.addList.splice(index, 1)
          }
        } else {
          if (item.address_id === indexObj) {
            _this.editIndex = index
            return
          }
        }
      })
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
    dataValid (consignee, region, address, mobile) {
      if (consignee === '' || region === '' || address === '' || mobile === '') {
        weui.alert('请填写完整收货信息')
        return false
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
        weui.alert('手机号码填写不正确')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
/*@import '/static/style/weui2.css';*/
@import '/static/style/vue-citys-picker.css';
body {
  padding-bottom: 60px;
}

.address>div {
  background: #fff;
  padding: 15px 15px 0 15px;
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
.setDefault{ color:#d6244f; }
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
  border-color: #d6244f;
  color: #d6244f;
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
