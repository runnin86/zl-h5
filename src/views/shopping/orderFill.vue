<template>
<div>
  <div class="row nav-center">
    <div class="col-xs-2 backBtn">
      <a href="javascript:history.back(-1)">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>{{oneBuyType==='checkout'?'填写订单':'确认订单'}}</span>
    </div>
    <div class="col-xs-2"></div>
  </div>

  <div class="row mainContent" v-if="orderSuccess === 'fill'">
    <div class="receiverInfor">
      <p class="title_p">收货人信息</p>
      <table class="inforShow" v-if="!isEditAddress&&addressList[checkState]" data-value="checkState">
        <tr>
          <td class="td">
            <span>
              {{addressList[checkState].consignee}} &nbsp;&nbsp;{{addressList[checkState].mobile}}
            </span>
          </td>
          <td rowspan="5" class="lastTd">
            <a @click="editInfor" style="width:auto;">
              <i class="iconfont-yzg icon-yzg-chevron"></i>
            </a>
          </td>
        </tr>
        <tr>
          <td class="td">
            <span id="region_show">
              {{addressList[checkState].country}} -
              {{addressList[checkState].province}} -
              {{addressList[checkState].city}} -
              {{addressList[checkState].district}}
            </span>
          </td>
        </tr>
        <tr>
          <td class="td">
            <span id="address_show">{{addressList[checkState].address}}</span>
          </td>
        </tr>
      </table>
      <div class="addressDetails" v-if="isEditAddress||addressList.length===0">
        <h6>请选择您的收货地址</h6>
        <div v-for="(item,itemIndex) in addressList">
          <div class="radio">
            <label v-if="item.id === '0'">
              <input type="radio" :value="itemIndex" v-model="checkState">新增收货地址
            </label>
            <div v-else>
              <label>
  					    <input type="radio" :value="itemIndex" v-model="checkState"
                  @click="checkAddress(itemIndex)">{{item.consignee}}
    					</label>
              <a @click="deleteAdd(item.id)">[删除当前地址]</a>
            </div>
          </div>
          <table class="addFillIn" v-if="checkState == itemIndex">
            <tr>
              <td>*收 &nbsp;货 人：</td>
              <td>
                <input type="text" v-model="item.consignee" placeholder="请填写收货人姓名" class="form-control" />
              </td>
            </tr>
            <tr>
              <td>*省 &nbsp;市 区：</td>
              <td>
                <wv-city-picker title="" :location="location" @get-val="addressPick"></wv-city-picker>
              </td>
            </tr>
            <tr>
              <td>*详细地址：</td>
              <td>
                <input type="text" v-model="item.address" placeholder="请填写详细地址" class="form-control" />
              </td>
            </tr>
            <tr>
              <td>*手机号码：</td>
              <td>
                <input type="text" v-model="item.mobile" placeholder="请填写手机号码" class="form-control" />
              </td>
            </tr>
          </table>
        </div>
        <div class="radio" v-if="addAddress">
          <label>
  					 <input type="radio" @click="addNewAddress">新增收货地址
  				</label>
        </div>
        <table class="addFillIn" v-if="checkState=='add'">
          <tr>
            <td>*收 &nbsp;货 人：</td>
            <td>
              <input type="text" placeholder="请填写收货人信息" v-model="newAddName" class="form-control" />
            </td>
          </tr>
          <tr>
            <td>*省 市 区：</td>
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
        <a @click="saveNext()" class="btn btn-danger">保存并下一步</a>
      </div>
    </div>

    <div class="goodsDetail">
      <p class="title_p">商品详情</p>
      <table>
        <tr v-for="good in cartList">
          <td class="imgDetails">
            <img :src="img_domain + good.img" />
          </td>
          <td class="subDetails">
            <p>{{good.pName}}</p>
            <p class="goodsQuantity">数量：{{good.num}}</p>
            <p class="redColor">{{good.price}}</p>
          </td>
        </tr>
      </table>
    </div>
    <!-- <div class="fillNotice">
      <p>注：跨境商品无法使用发票</p>
    </div> -->
    <div class="orderAccount">
      <p class="title_p">订单结算</p>
      <table>
        <tr>
          <td>商品总价：<span>￥{{totalMoney}}</span></td>
        </tr>
        <tr v-if="addressList.offset > 0">
          <td>可用抵用金：<span>￥{{addressList.offset}}</span></td>
        </tr>
        <!-- <tr v-for = "shipping in supplier_info">
          <td>运费：￥{{shipping.shipping_fee}}</td>
        </tr> -->
        <tr v-if="addressList.shipping_fee > 0">
          <td>运费：<span>￥{{addressList.shipping_fee}}</span></td>
        </tr>
        <tr>
          <td>应付款金额：<span>￥{{totalMoney}}</span></td>
        </tr>
        <!-- <tr>
          <td class="redColor" style="text-align:right;">满99元包邮</td>
        </tr> -->
      </table>
    </div>

    <div class="placeOrder">
      <input type="button" value="提交订单" class="btn btn-danger loginBtn" @click="submitting()" />
    </div>
  </div>
  <div class="row mainContent" v-if="orderSuccess === 'submitSuc'">
    <!--提交订单成功-->
    <div class="receiverInfor payment">
      <p class="title_p">支持以下支付平台付款</p>
      <ul>
        <li style="position: relative">
          <label>
                        <input type="radio" name="paymentSel" value="alipay" checked="true" style="opacity:0"/>微信支付
                    </label>
          <i class="iconfont-yzg icon-yzg-zhifufangshi-weixinzhifu selectSign"></i>
        </li>
      </ul>
    </div>
    <div class="orderInfo">
      <table v-for="item in orderInfo.order_all">
        <tr>
          <td>订单号：{{item.order.order_sn}}</td>
        </tr>
        <tr>
          <td>订单总额：{{item.total_fee}}</td>
        </tr>
        <tr>
          <td>已优惠：￥{{item.order.offset}}</td>
        </tr>
        <tr>
          <td>还需支付：{{item.total.amount_formated}}</td>
        </tr>
        <tr>
          <td>
            <router-link :to="{ name: 'ShopOrdDet',path: '/shopOrdDet', query: { orderId: item.order.order_id}}">
              <span class="redColor">查看详细信息</span>
            </router-link>
          </td>
        </tr>
      </table>
    </div>
    <div class="orderInfo totalMoney">
      <p>总金额：<span>{{orderInfo.summoney}}</span></p>
    </div>
    <div class="placeOrder">
      <a @click="payNow" class="weui-btn weui-btn_primary">微信支付</a>
    </div>
  </div>
  <div id="allmap"></div>
</div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'
import BMap from 'BMap'
import qs from 'qs'

export default {
  activated() {
    this.cartList = []
    this.totalMoney = 0
    this.loadCart()
    this.loadAddress()
    this.$store.commit('CHANGE_IS_INDEX', false)
  },
  data() {
    return {
      cartList: [],
      totalMoney: 0,
      addressList: [],
      img_domain: 'http://img.zulibuy.com/images/',
      newAddName: '', // 新增收货人信息
      newAddProvince: '河北省-保定市-涞源县',
      newAddDetail: '',
      newAddTel: '',
      oneBuyType: this.$route.query.step, // 购买类型
      orderSuccess: 'fill', // 填写订单成功是否显示
      checkState: '0', // 地址选择状态  按照索引显示
      isEditAddress: false, // 是否编辑
      addAddress: true, // 是否显示新增按钮  当已经有新增时隐藏，默认只能添加一个新增地址
      // 提交订单成功页面
      orderInfo: null,
      location: {
        id: '130000 130600 130630',
        name: '河北省 保定市 涞源县'
      }
    }
  },
  methods: {
    addressPick(name, code) {
      name = name.split(' ')
      if (this.checkState === 'add') {
        this.newAddProvince = name[0] + '-' + name[1] + '-' + name[2]
      } else {
        this.addressList[this.checkState].region = name[0] + '-' + name[1] + '-' + name[2]
      }
    },
    /*
     * 查询购物车信息
     */
    loadCart() {
      // 设置总金额和总数目为0
      this.totalMoney = this.selectCounts = 0
      this.$http.get('cart/cartList', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        // console.log(data)
        if (code === 1) {
          // 计算总价和数量
          for (var i = 0; i < data.length; i++) {
            if (data[i].isCheck === 1) {
              this.cartList.push(data[i])
              this.totalMoney += parseFloat(data[i].num) * parseFloat(data[i].price)
            }
          }
        } else {
          $.toast(msg, 'forbidden')
          console.warn('获取购物车失败:' + msg)
        }
      }).catch((e) => {
        console.error('获取购物车失败:' + e)
      })
    },
    /*
     * 查询用户地址信息
     */
    loadAddress() {
      this.$http.get('/user/addressList', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {data, code, msg}}) => {
        console.log(data)
        if (code === 1) {
          this.addressList = data.addressList
          this.baiduMapFuc(data.addressList[0].city + data.addressList[0].district)
        } else {
          $.toast(msg, 'forbidden')
        }
      }, (response) => {
        console.log(response)
      })
    },
    // 添加新地址状态改变
    addNewAddress() {
      this.checkState = 'add'
      this.location = {
        id: '130000 130600 130630',
        name: '河北省 保定市 涞源县'
      }
    },
    // 判断是否为编辑状态
    editInfor() {
      this.isEditAddress = true
      this.location.name = this.addressList[this.checkState].province + ' ' +
        this.addressList[this.checkState].city + ' ' +
        this.addressList[this.checkState].district
    },
    checkAddress(i) {
      this.location.name = this.addressList[i].province + ' ' +
        this.addressList[i].city + ' ' +
        this.addressList[i].district
      // 去匹配距离
      this.baiduMapFuc(this.addressList[i].city + this.addressList[i].district)
    },
    // 保存并下一步
    saveNext() {
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
            _this.loadAddress()
          } else {
            $.toast(msg, 'cancel')
          }
        }).catch(function(error) {
          console.log(error)
        })
      }
    },
    /*
     *地址删除操作
     */
    deleteAdd(objId) {
      weui.confirm('是否确认删除当前收货地址', () => {
        // 确认
        this.$http.delete('/user/delAddress', {
          params: {
            aid: objId
          },
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(({data: {data, code, msg}}) => {
          if (code === 1) {
            // 重新获取数据
            this.loadAddress()
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
     * 提交订单
     */
    submitting() {
      this.$http.post('order/createOrder', {}, {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(function({data: {data, code, msg}}) {
        if (code === 1) {
          // console.log(data)
          this.$router.push({
            path: 'orderfill',
            query: {
              step: 'submit'
            }
          })
        } else {
          $.toast(msg, 'forbidden')
          console.error('结算商品失败:' + msg)
        }
      }).catch(function(error) {
        console.log('catch' + error)
      })
    },
    /*
     ** 立即支付
     */
    payNow() {
      let orderList = ''
      // 遍历订单 获取所有订单号
      for (var i in this.orderInfo.order_all) { // 不使用过滤
        console.log(i, ':', this.orderInfo.order_all[i])
        orderList += this.orderInfo.order_all[i].order.order_id + ','
      }
      // 去掉拼接订单字符串的最后一个逗号
      let lastIndex = orderList.lastIndexOf(',')
      if (lastIndex > -1) {
        orderList = orderList.substring(0, lastIndex)
      }
      let payParams = {
        str: orderList,
        pay_id: '3'
      }
      let zhis = this
      this.$http.post('flow.php?step=make_big', qs.stringify(payParams), {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(function({data: {data, errcode, msg}}) {
        console.log(data)
        if (errcode === 0) {
          if (data.jsApiParameters) {
            window.WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(data.jsApiParameters),
              function(res) {
                // err_code,err_desc,err_msg
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                  // zhis.$router.push({path: '/userCenter/setStore'})
                  $.toast('支付成功')
                  setTimeout(() => {
                    zhis.$router.push({
                      name: 'OrderList',
                      params: {
                        orderAct: 1
                      }
                    })
                  }, 2000)
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                  // 取消
                  $.toast('用户取消支付', 'cancel')
                } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
                  // 支付失败
                  $.toast(res.err_desc, 'forbidden')
                }
              })
          }
        } else {
          $.toast(msg, 'forbidden')
          console.error(msg)
        }
      }).catch(function(error) {
        console.log('error' + error)
      })
    },
    /*
     * 地址填写验证
     */
    dataValid(consignee, region, address, mobile) {
      if (consignee === '' || region === '' || address === '' || mobile === '') {
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
     * 百度地图方法
     */
    baiduMapFuc(toAddress) {
      if (toAddress.indexOf('市辖区') === 0) {
        toAddress = toAddress.split('市辖区')[1]
      }
      // 获取坐标
      let myGeo = new BMap.Geocoder()
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint('河北省保定市涞源县广泉大街西神山村村委会', function(point) {
        if (point) {
          console.log(point)
        } else {
          console.error('您选择地址没有解析到结果!')
        }
      }, '保定市')
      // 计算两地驾车时间和距离
      let map = new BMap.Map('allmap')
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 12)
      let output = '到' + toAddress + '驾车需要'
      var searchComplete = function(results) {
        if (transit.getStatus() !== 0) {
          return
        }
        let plan = results.getPlan(0)
        output += plan.getDuration(true) + '\n' // 获取时间
        output += '总路程为：'
        output += plan.getDistance(true) + '\n' // 获取距离
      }
      let transit = new BMap.DrivingRoute(map, {
        renderOptions: {
          map: map
        },
        onSearchComplete: searchComplete,
        onPolylinesSet: function() {
          setTimeout(function() {
            alert(output)
          }, 1000)
        }
      })
      transit.search('河北省保定市涞源县广泉大街西神山村村委会', toAddress)
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

body,
html,
#allmap {
  display: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  font-family: "微软雅黑";
}

.addFillIn .cell_box {
  width: 80%;
}
</style>
