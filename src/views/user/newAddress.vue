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
              <p @click="showCityPicker('newAddProvince')" class="choiceProv">{{newAddProvince}}</p>
            </td>
          </tr>
          <tr>
            <td>*详细地址：</td>
            <td>
              <input type="text" placeholder="请填写详细地址" v-model="newAddDetail" class="form-control" />
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
    <citys-picker :city="data" :init-value="defaultVal" @confirm="confirmCP" ref="address"></citys-picker>
    <!-- <p style="text-align: center;" @click="showCityPicker('addressStr')">{{addressStr}}</p> -->
  </div>
</div>
</template>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'
import CitysPicker from 'vue-citys-picker'
import CityData from '../../../static/json/citydata.json'
export default {
  components: {
    CitysPicker
  },
  activated() {
    this.$store.commit('CHANGE_IS_INDEX', false)
  },
  data() {
    return {
      titleName: '新增地址',  // title显示标题
      newAddName: '', // 新增收货人信息
      newAddProvince: '请选择所在省市',
      newAddDetail: '',
      newAddTel: '',
      data: CityData,   // 地区选择控件
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
  methods: {
    // 去除字符串空格
    removeSpace(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    // 地址选择
    confirmCP(values) {
      this.$set(this.$data, this.pickedId, values[0].name + '-' + values[1].name + '-' + values[2].name)
      this.pickedId = null
    },
    // 显示地址选择器
    showCityPicker(id) {
      this.pickedId = id
      this.$refs['address'].open()
    },
    savenew() {
      var _this = this
      var validResult = ''
      validResult = this.dataValid(this.newAddName, this.newAddProvince, this.newAddDetail, this.newAddTel)
      if (validResult) {
        let saveParam = {
          pcd: this.newAddProvince,
          address: this.newAddDetail,
          consignee: this.newAddName,
          mobile: this.newAddTel,
          submit: '保存',
          act: 'act_edit_address',
          address_id: ''
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
    dataValid (consignee, region, address, mobile) {
      if (consignee === '' || region === '' || address === '' || mobile === '') {
        $.toast('请填写完整收货信息', 'forbidden')
        return false
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
        $.toast('手机号码填写不正确', 'forbidden')
        return false
      }
      return true
    }
  },
  created() { // 创建状态初始化
    // this.confirm(this.defaultVal)
  }
}
</script>


<style scoped>
@import '/static/style/orderfill.css';
@import '/static/style/vue-citys-picker.css';
body {
  /*background: #eee;*/
  color: #3a3a3a;
  font-size: 14px
}
.saveNew{ width:100px; height:38px; text-align: center; margin:30px auto 20px; border-radius:4px; cursor: pointer;}
.saveNew a{ color:#fff; display: block; height:38px; line-height: 38px; }
</style>
