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
        <tr>
          <td>店铺网址：</td>
          <td><input type="text" value="http://yy.yizhigou.cn" v-model="shop_url" readonly /></td>
        </tr>
        <tr>
          <td>我的等级：</td>
          <td><input type="text" value="服务商" v-model="myRank" readonly /></td>
        </tr>
        <tr>
          <td>我的上级：</td>
          <td><input type="text" value="服务商" v-model="myParentRank" readonly /></td>
        </tr>
        <tr>
          <td>上级电话：</td>
          <td><input type="text" value="服务商" v-model="user_info.parent_phone" readonly /></td>
        </tr>
        <tr>
          <td>抵用金：</td>
          <td>
            <span class="use-init_money">￥{{user_info.offset_money}}</span>
            <router-link to="/userCenter/accountManage/sellerFundUse"  class="weui-btn weui-btn_mini weui-btn_warn">用途明细</router-link>
          </td>
        </tr>
      </table>
      <a class="rightCash" @click="set_config">确认设置</a>
    </div>
  </div>
</template>

<style>
  .weui-btn_warn{vertical-align: middle}
  .use-init_money{width:50%;display:inline-block}
  .setting{ padding-top:54px; background: #fff }
  .setting table{  width:100%; }
  .setting table td{ height:50px; line-height: 50px; border-bottom:1px solid #f1f1f1; text-align: left }
  .setting table td:first-child{ width:120px; text-align: right; padding-right:8px; }
  .setting table td input{ border:0; height:50px; line-height: 50px; width:100%; outline: none; }
  .setting table td .storeName{ width:100px; }
  .rightCash{ display:block; background: #d6244f; width:100px; height:36px; line-height: 36px; color:#fff; margin:18px auto; text-align: center; border-radius:4px;}
  .rightCash:hover, .rightCash:active, .rightCash:visited, .rightCash:link{ color:#fff; }
</style>

<script>
import qs from 'qs'
import weui from 'weui.js'

export default {
  data () {
    return {
      title_name: '账号管理',
      self_sign: '',
      shop_url: '',
      user_info: '',
      store_info: '',
      myRank: '',
      myParentRank: ''
    }
  },
  methods: {
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
          this.shop_url = data.shop_url
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
      this.myRank = this.user_info.user_rank === '1' ? '服务商' : this.user_info.user_rank === '2' ? '合伙人' : this.user_info.user_rank === '3' ? '白金合伙人' : '董事'
      this.myParentRank = this.user_info.parent_user_rank === '1' ? '南华汇（服务商）' : this.user_info.parent_user_rank === '2' ? '南华汇（合伙人）' : this.user_info.parent_user_rank === '3' ? '南华汇（白金合伙人）' : '南华汇（董事）'
    }
  },
  activated () {
    this.loadData()
  }
}
</script>
