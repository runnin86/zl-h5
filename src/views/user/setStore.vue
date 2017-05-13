<template>
  <div>
    <div class="row yzg-title">
      <div class="col-xs-2 backBtn">
        <a @click="$parent.back()">
          <i class="iconfont-yzg icon-yzg-back"></i>
        </a>
      </div>
      <div class="col-xs-8 shop-name">
        <span>{{title_name}}</span>
      </div>
      <div class="col-xs-2 shop-bag">
        <span class="iconfont-yzg icon-yzg-fudaoshangcheng"></span>
      </div>
    </div>
    <div class="row setting">
      <table>
        <tr>
          <td>店铺设置：</td>
          <td><input type="text" placeholder="英文加数字五位" class="storeName" v-model="setWebsite"/>.yizhigou.cn</td>
        </tr>
        <tr>
          <td>店铺名称：</td>
          <td><input type="text" placeholder="例如：洋洋的店铺" v-model="setName"></td>
        </tr>
        <tr>
          <td>手机号：</td>
          <td><input type="text" placeholder="请填写手机号" v-model="phone"/></td>
        </tr>
        <tr>
          <td>推荐人手机号：</td>
          <td><input type="text" placeholder="没有可不填" v-model="recPhone"/></td>
        </tr>
      </table>
      <a class="rightCash" @click="set_confirm">确认设置</a>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import weui from 'weui.js'

export default {
  data () {
    return {
      title_name: '店铺设置',
      setWebsite: '',
      setName: '',
      phone: '',
      recPhone: ''
    }
  },
  methods: {
    set_confirm () {
      let kd = {
        alias_code: this.setWebsite,
        store_name: this.setName,
        mobile: this.phone,
        recommend_phone: this.recPhone
      }
      this.$http.post('create.php?act=step_2', qs.stringify(kd))
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          weui.alert('设置成功')
          this.$router.push({path: '/userCenter'})
          console.log(data)
        } else {
          console.error('获取数据失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.error(response)
      })
    }
  }
}
</script>

<style>
.setting{ padding-top:54px; background: #fff }
.setting table{  width:100%; }
.setting table td{ height:40px; line-height: 40px; border-bottom:1px solid #f1f1f1; text-align: left }
.setting table td:first-child{ width:120px; text-align: right; padding-right:8px; }
.setting table td input{ border:0; height:40px; line-height: 40px; width:100%; outline: none; }
.setting table td .storeName{ width:100px; }
.rightCash{ display:block; background: #d6244f; width:100px; height:36px; line-height: 36px; color:#fff; margin:18px auto; text-align: center; border-radius:4px;}
.rightCash:hover, .rightCash:active, .rightCash:visited, .rightCash:link{ color:#fff; }
</style>
