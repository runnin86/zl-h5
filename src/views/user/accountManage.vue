<template>
  <div>
    <div class="row yzg-title" style="position:static">
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
        <!-- <tr>
          <td>店铺头像：</td>
          <td>
            <div style="display:flex">
              <input type="text" value="" placeholder="头像尺寸建议80*80像素">
              <span></span>
              <span class="iconfont-yzg icon-yzg-arrow"></span>
            </div>
          </td>
        </tr> -->
        <tr>
          <td>店主昵称：</td>
          <td><input type="text" value="不知道昵称是什么" v-model="user_info.nickname"></td>
        </tr>
        <tr>
          <td>个性签名：</td>
          <td><input type="text" placeholder="请填写个性签名" v-model="store_info.signature" /></td>
        </tr>
        <tr>
          <td>手机号：</td>
          <td><input type="text" placeholder="请填写手机号" v-model="store_info.mobile" /></td>
        </tr>
        <tr>
          <td>店铺名称：</td>
          <td><input type="text" placeholder="请填写店铺名称" v-model="store_info.store_name" /></td>
        </tr>
       <!--  <tr>
          <td>店铺网址：</td>
          <td><input type="text" value="http://yy.yizhigou.cn" v-model="shop_url" readonly /></td>
        </tr> -->
        <tr>
          <td>我的等级：</td>
          <td><input type="text" value="服务商" v-model="myRank" readonly @click="alertInfo()"/></td>
        </tr>
        <tr>
          <td>我的上级：</td>
          <td><input type="text" value="服务商" v-model="myParentRank" readonly @click="alertInfo()" /></td>
        </tr>
        <tr>
          <td>上级电话：</td>
          <td><input type="text" value="服务商" v-model="user_info.parent_phone" readonly @click="alertInfo()"/></td>
        </tr>
        <tr>
          <td>抵用金：</td>
          <td>
            <span class="use-init_money" @click="alertInfo()">￥{{user_info.offset_money}}</span>
            <router-link to="/userCenter/accountManage/sellerFundUse"  class="weui-btn weui-btn_mini redBgColor">用途明细</router-link>
          </td>
        </tr>
      </table>
      <a class="btn redBgColor rightCash" @click="set_config">确认设置</a>
    </div>
  </div>
</template>

<style scoped>
  .redBgColor{vertical-align: middle}
  .weui-btn{border-radius:0;}
  .use-init_money{width:50%;display:inline-block}
  .setting{ background: #fff }
  .setting table{  width:100%; }
  .setting table td{ height:50px; line-height: 50px; border-bottom:1px solid #f1f1f1; text-align: left }
  .setting table td:first-child{ width:120px; text-align: right; padding-right:8px; }
  .setting table td input{ border:0; height:50px; line-height: 50px; width:100%; outline: none; }
  .setting table td .storeName{ width:100px; }
  .rightCash{ display:block; width:70%; margin:18px auto; height:36px; text-align: center; border-radius:0;}
  .rightCash:hover, .rightCash:active, .rightCash:visited, .rightCash:link{ color:#fff; }
</style>

<script>
import qs from 'qs'
import weui from 'weui.js'
import $ from 'zepto'

export default {
  data () {
    return {
      title_name: '账号管理',
      self_sign: '',
      // shop_url: '',
      user_info: '',
      store_info: '',
      myRank: '',
      myParentRank: ''
    }
  },
  methods: {
    alertInfo () {
      $.toast('此信息不可设置', 'forbidden')
    },
    set_config () {
      let kd = {
        logo_img: '',
        store_id: this.store_info.store_id,
        mobile: this.store_info.mobile,
        action_type: 'update',
        signature: this.store_info.signature,
        store_name: this.store_info.store_name
      }
      this.$http.post('store.php?act=update', qs.stringify(kd))
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
    },
    loadData () {
      this.$http.get('store.php', {
        params: {
          act: 'setting'
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // this.shop_url = data.shop_url
          this.user_info = data.user_info
          this.store_info = data.store_info
          // console.log(data)
          this.rankCount()
        } else {
          console.error('获取数据失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.error(response)
      })
    },
    rankCount () {
      this.user_info.user_rank === '1' ? this.myRank = '服务商' : this.user_info.user_rank === '2' ? this.myRank = '合伙人' : this.user_info.user_rank === '3' ? this.myRank = '白金合伙人' : this.myRank = '董事'
      this.user_info.parent_user_rank === '1' ? this.myParentRank = '南华汇（服务商）' : this.user_info.parent_user_rank === '2' ? this.myParentRank = '南华汇（合伙人）' : this.user_info.parent_user_rank === '3' ? this.myParentRank = '南华汇（白金合伙人）' : this.user_info.parent_user_rank === '4' ? this.myParentRank = '南华汇（董事）' : this.myParentRank = ''
    }
  },
  activated () {
    this.loadData()
  }
}
</script>
