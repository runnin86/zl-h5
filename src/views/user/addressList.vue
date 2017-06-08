<template>
<div>
  <div class="row yzg-title" style="position:relative;width:auto;">
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

  <div class="address" style="margin-top:16px">
    <div class="row singleAddress" v-for="(address, itemIndex) in addressList">
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
          <div class="col-xs-6" @click="setDefaultAddress(address.id)"
            :class="address.lastUse === 1 ? 'setDefault redColor' : ''">
              <i class="iconfont-yzg "
                :class="address.lastUse === 1 ? 'icon-yzg-xuanzhong' : 'icon-yzg-weixuanzhong'">
              </i>
              设为默认地址
          </div>
          <div class="col-xs-6">
  					<a @click="editAddress(address)">
  						<i class="iconfont-yzg icon-yzg-bianji"></i> 编辑&nbsp; &nbsp; &nbsp;
  					</a>
            <a @click="deleteAddress(address.id)">
              <i class="iconfont-yzg icon-yzg-shanchu1"></i> 删除
            </a>
          </div>
				</div>
      </div>
      <table v-if="editState === address.id">
        <tr>
          <td>配送区域：</td>
          <td>
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
          <td>电　　话：</td>
          <td>
						<input type="tel" class="form-control" placeholder="请填写联系电话" v-model="address.mobile"/>
					</td>
        </tr>
        <tr>
          <td colspan="2" class="saveAdd">
            <input type="button" class="form-control redAllBorCol" value="保存" @click="saveAddress(address)"/>
            <input type="button" class="form-control redAllBorCol" value="取消" @click="editState = -1" />
          </td>
        </tr>
      </table>
    </div>
    <router-link :to="{path:'/userCenter/addressList/newAddress'}">
      <a class="btn redBgColor" style="display:block;">新增收货地址</a>
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
      editState: 0,
      addressList: [],
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
      this.location.name = name
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
          this.addressList = data.addressList
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
     *
     */
    editAddress(address) {
      this.editState = address.id
      this.location.name = address.province + ' ' + address.city + ' ' + address.district
    },
    /*
    * 删除地址
    */
    deleteAddress(aid) {
      weui.confirm('确定删除当前收货地址吗?', () => {
        // 确认
        this.$http.delete('/user/delAddress', {
          params: {
            aid: aid
          },
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(({data: {data, code, msg}}) => {
          if (code === 1) {
            // 重新获取数据
            this.loadAddressList()
          } else {
            $.toast(msg, 'forbidden')
          }
        }).catch(function(error) {
          $.toast(error, 'forbidden')
          console.error('catch' + error)
        })
      }, () => {
        // 取消
      })
    },
    /*
    * 地址保存
    */
    saveAddress(address) {
      // 地址采用选择器的
      address.province = this.location.name.split(' ')[0]
      address.city = this.location.name.split(' ')[1]
      address.district = this.location.name.split(' ')[2]

      if (this.dataValid(address.consignee, address.province, address.address, address.mobile)) {
        let _this = this
        this.$http.post('/user/editAddress', qs.stringify(address), {
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(function({data: {data, code, msg}}) {
          if (code === 1) {
            _this.editState = -1
            $.toast(msg)
          } else {
            $.toast(msg, 'forbidden')
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
    setDefaultAddress(obj) {
      let _this = this
      let defAddParam = {
        id: obj
      }
      this.$http.post('/user/defaultAddress', qs.stringify(defAddParam), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(function({data: {data, code, msg}}) {
        if (code === 1) {
          $.toast(msg)
          // 重新获取数据
          _this.loadAddressList()
        } else {
          $.toast(msg, 'forbidden')
        }
      }).catch(function(error) {
        $.toast(error, 'forbidden')
        console.error(error)
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
