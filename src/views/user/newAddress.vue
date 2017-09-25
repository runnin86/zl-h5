<template>
<div>
  <div class="row yzg-title" style="position:relative;width:auto;">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>新增地址</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{path: '/index'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>

  <div class="row mainContent" style="margin-top: 2px;">
    <div class="receiverInfor">
      <div class="addressDetails">
        <table class="addFillIn">
          <tr>
            <td>*收 &nbsp;货 人：</td>
            <td>
              <input type="text" placeholder="请填写收货人姓名" v-model="newAddName" class="form-control" />
            </td>
          </tr>
          <tr>
            <td>*省 &nbsp;市 区：</td>
            <td>
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
            <td>*手机号码：</td>
            <td>
              <input type="tel" placeholder="请填写收货人手机号码" v-model="newAddTel" class="form-control" />
            </td>
          </tr>
        </table>
        <div>
          <a @click="saveAddress()"
            class="btn redBgColor" style="display:block;">保存收货地址</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import qs from 'qs'
import $ from 'zepto'
import weui from 'weui.js'

export default {
  activated() {
    this.newAddName = this.newAddDetail = this.newAddTel = ''
    this.$store.commit('CHANGE_IS_INDEX', false)
  },
  data() {
    return {
      newAddName: '', // 新增收货人信息
      newAddProvince: '河北省-保定市-涞源县',
      newAddDetail: '',
      newAddTel: '',
      location: {
        id: '130000 130600 130630',
        name: '河北省 保定市 涞源县'
      }
    }
  },
  methods: {
    /* 地址选择 */
    addressPick(name, code) {
      name = name.split(' ')
      this.newAddProvince = name[0] + '-' + name[1] + '-' + name[2]
    },
    /*
     * 保存收货地址
     */
    saveAddress() {
      var _this = this
      var validResult = ''
      validResult = this.dataValid(this.newAddName, this.newAddProvince, this.newAddDetail, this.newAddTel)
      if (validResult) {
        let saveParam = {
          pcd: this.newAddProvince,
          address: this.newAddDetail,
          consignee: this.newAddName,
          mobile: this.newAddTel
        }
        this.$http.post('/user/addAddress', qs.stringify(saveParam), {
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(function({data: {data, code, msg}}) {
          if (code === 1) {
            weui.confirm('创建地址成功，继续添加?', () => {
              _this.newAddName = ''
              _this.newAddProvince = ''
              _this.newAddDetail = ''
              _this.newAddTel = ''
            }, () => {
              history.back()
            })
          } else {
            $.toast(msg, 'cancel')
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
    dataValid(consignee, region, address, mobile) {
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
  }
}
</script>


<style scoped>
@import '/static/style/orderfill.css';
body {
  /*background: #eee;*/
  color: #3a3a3a;
  font-size: 14px
}

.saveNew {
  width: 100px;
  height: 38px;
  text-align: center;
  margin: 30px auto 20px;
  border-radius: 4px;
  cursor: pointer;
}

.saveNew a {
  color: #fff;
  display: block;
  height: 38px;
  line-height: 38px;
}

.addFillIn .cell_box {
  width: 80%;
}
</style>
