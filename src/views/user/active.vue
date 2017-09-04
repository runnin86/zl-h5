<template>
<div>
  <div class="row nav-center">
    <div class="col-xs-2 backBtn">
    </div>
    <div class="col-xs-8 loginTitle">激活</div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{path: '/category'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>
  <div class="wdTable row">
    <table>
      <tr>
        <td>真实姓名</td>
        <td>
          <input class="form-control" v-model="name" placeholder="请填写真实姓名" />
        </td>
      </tr>
      <tr>
        <td>手机号码</td>
        <td>
          <input class="form-control" type="number" v-model="phone" placeholder="请填写手机号码" />
        </td>
      </tr>
      <tr>
        <td>推荐人</td>
        <td>
          <input class="form-control" type="number" v-model="parentPhone" placeholder="请填写推荐人手机号码" />
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align:left;">
          请仔细填写上述信息,一旦确认后不可更改! 请仔细填写上述信息,一旦确认后不可更改!请仔细填写上述信息,一旦确认后不可更改! 请仔细填写上述信息,一旦确认后不可更改!
        </td>
      </tr>
    </table>
    <a @click="userActive()" class="rightCash">立即激活</a>
  </div>
</div>
</template>

<script>
import qs from 'qs'
import weui from 'weui.js'

export default {
  activated() {},
  data() {
    return {
      phone: null,
      name: null,
      parentPhone: null
    }
  },
  methods: {
    /*
     * 绑定微信
     */
    userActive() {
      if (this.inputValid(this.phone, this.parentPhone, this.name)) {
        let zhis = this
        let name = this.phone
        let wc = this.name
        let param = {
          'name': name,
          'weChat': wc,
          'type': 'weChat'
        }
        this.$http.post('user/bindInfo', qs.stringify(param), {
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(function({data: {data, code, msg}}) {
          if (code === 1) {
            // 没有缓存强制
            let winUserNhh = JSON.parse(window.localStorage.getItem('zlUser'))
            winUserNhh['weChat'] = wc
            winUserNhh['name'] = name
            window.localStorage.setItem('zlUser', JSON.stringify(winUserNhh))
            // 提示和跳转
            weui.toast('绑定成功')
            setTimeout(() => {
              zhis.$parent.back()
            }, 2500)
          } else {
            weui.alert(msg)
          }
        }).catch(function(e) {
          console.error(e)
        })
      }
    },
    /*
     *输入验证
     */
    inputValid(phone, parentPhone, name) {
      if (!phone || !(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        weui.alert('手机号码为空或手机号格式填写不正确')
        return false
      }
      if (!parentPhone || !(/^1(3|4|5|7|8)\d{9}$/.test(parentPhone))) {
        weui.alert('推荐人手机号码为空或推荐人手机号格式填写不正确')
        return false
      }
      if (!name) {
        weui.alert('请填写真实姓名')
        return false
      }
      return true
    }
  }
}
</script>

<style>
.wdTable {
  margin-top: 50px;
  background: #fff;
  padding: 10px
}

.wdTable table {
  width: 100%
}

.wdTable table td {
  padding: 7px 5px
}

.wdTable table td:first-child {
  width: 80px;
  text-align: right;
  padding-right: 5px
}

.rightCash {
  display: block;
  background: #d6244f;
  /*width: 100px;*/
  height: 40px;
  line-height: 40px;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  border-radius: 8px;
  margin-top: 8px
}
</style>
