<template>
<div>
  <div class="row nav-center">
    <div class="col-xs-2 backBtn">
      <a href="javascript:history.back(-1)">
				<i class="iconfont-yzg icon-yzg-back"></i>
			</a>
    </div>
    <div class="col-xs-8 loginTitle">{{titleName}}</div>
    <div class="col-xs-2"></div>
  </div>
  <div class="row mainContent" v-if="orderSuccess === 'fill'">
    <div class="receiverInfor">
      <p class="title_p">收货人信息</p>
      <table class="inforShow" v-if="!editState" data-value="checkState">
        <tr>
          <td class="td">
            <span v-if="dataItems[checkState].consignee">{{dataItems[checkState].consignee}} &nbsp;&nbsp;&nbsp;{{dataItems[checkState].mobile}}</span>
          </td>
          <td rowspan="5" class="lastTd">
            <a @click="editInfor" style="width:auto;">
							<i class="iconfont-yzg icon-yzg-chevron"></i>
						</a>
          </td>
        </tr>
        <tr>
          <td class="td">
            <span id="region_show">{{dataItems[checkState].region}}</span>
          </td>
        </tr>
        <tr>
          <td class="td">
            <span id="address_show">{{dataItems[checkState].address}}</span>
            <input id="address" type="hidden" v-model="dataItems[checkState].address">
          </td>
        </tr>
      </table>
      <div class="addressDetails" v-if="editState">
        <h6>请选择您的收货地址</h6>
        <div v-for=" (item,itemIndex) in dataItems">
          <div class="radio">
            <label v-if="item.address_id === '0'">
              <input type="radio" :value="itemIndex" v-model="checkState">新增收货地址
            </label>
            <div v-else>
              <label>
  					    <input type="radio" :value="itemIndex" v-model="checkState" @click="switchAdd(itemIndex)">{{item.consignee}}
    					</label>
              <a @click="deleteAdd(item.address_id)">[删除当前地址]</a>
            </div>
          </div>
          <table class="addFillIn" v-if="checkState == itemIndex">
            <tr>
              <td>*收 &nbsp;货 人：</td>
              <td>
                <input type="text" v-model="item.consignee" placeholder="请填写收货人姓名" class="form-control"/>
              </td>
            </tr>
            <tr>
              <td>*省 &nbsp;市  区：</td>
              <td>
                 <!-- <p class="choiceProv" @click="showCityPicker(itemIndex)">{{dataItems[itemIndex].region}}</p> -->
                 <wv-city-picker title="" :location="location" @get-val="addressPick"></wv-city-picker>
              </td>
            </tr>
            <tr>
              <td>*详细地址：</td>
              <td>
                <input type="text" v-model="item.address" placeholder="请填写详细地址" class="form-control"/>
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
        <div class="radio" v-if="xinzeng">
          <label>
  					 <input type="radio" id="newAdd" @click="newadd">新增收货地址
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
            <td>*省  市  区：</td>
            <td>
              <!-- <p class="choiceProv" @click="showCityPicker('newAddProvince')">{{newAddProvince}}</p> -->
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
        <tr v-if = "goodsDetail.offset > 0">
          <td>可用抵用金：<span>￥{{goodsDetail.offset}}</span></td>
        </tr>
        <!-- <tr v-for = "shipping in goodsDetail.total.supplier_info">
          <td>运费：￥{{shipping.shipping_fee}}</td>
        </tr> -->
        <tr v-if = "goodsDetail.shipping_fee > 0">
          <td>运费：<span>￥{{goodsDetail.total.shipping_fee}}</span></td>
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
        <input type="button" value="提交订单" class="btn btn-danger loginBtn" @click="submitting()"/>
    </div>
  </div>
  <div class="row mainContent" v-if="orderSuccess === 'submitSuc'">   <!--提交订单成功-->
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
        <div class="orderInfor">
            <table v-for = "item in orderInfor.order_all">
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
        <div class="orderInfor totalMoney">
            <p>总金额：<span>{{orderInfor.summoney}}</span></p>
        </div>
        <div class="placeOrder">
          <a @click="payNow" class="weui-btn weui-btn_primary">微信支付</a>
        </div>
    </div>
    <div v-if = "orderSuccess === 'errormsg'" class="errWarning">
      <div>
          <i class="iconfont-yzg icon-yzg-information"></i>
          <p>{{errorMsg}}</p>
        <!-- <router-link :to = "{ path: 'category'}"> -->
          <a href="/category">随便逛逛</a>
        <!-- </router-link> -->
      </div>
    </div>
</div>
</template>

<script>
import $ from 'zepto'
import weui from 'weui.js'
import qs from 'qs'

export default {
  activated() {
    this.cartList = []
    this.totalMoney = 0
    this.loadCart()
    this.$store.commit('CHANGE_IS_INDEX', false)
  },
  data() {
    return {
      cartList: [],
      totalMoney: 0,
      img_domain: 'http://img.zulibuy.com/images/',
      oneBuyType: this.$route.query.step,  // 购买类型
      orderSuccess: 'fill', // 填写订单成功是否显示
      titleName: '',  // title显示标题
      checkState: '0', // 地址选择状态  按照索引显示
      editState: false, // 是否编辑
      xinzeng: true, // 是否显示新增按钮  当已经有新增时隐藏，默认只能添加一个新增地址
      nowCheck: [], // 当前选择收货信息
      goodsTotal: '0', // 商品总价
      newAddName: '', // 新增收货人信息
      newAddProvince: '中国-河北省-保定市-涞源县',
      errorMsg: '',  // 如果购物车没有商品 则显示错误信息
      newAddDetail: '',
      newAddTel: '',
      dataItems: [{
        consignee: '',
        region: '',
        address: '',
        mobile: ''
      }],  // 地址列表
      originalAddress: {}, // 保存初始地址 供提交订单时改变地址所用
      goodsDetail: {
        total: [{
          amount_formated: '',
          supplier_info: []
        }]
      },  // 购买商品种类列表
      requestAddress: {}, // 提交订单请求地址参数
      // 提交订单成功页面
      orderInfor: null,
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
        this.newAddProvince = '中国' + '-' + name[0] + '-' + name[1] + '-' + name[2]
      } else {
        this.dataItems[this.checkState].region = '中国' + '-' + name[0] + '-' + name[1] + '-' + name[2]
      }
    },
    // 去除字符串空格
    removeSpace(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
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
          console.log(this.cartList)
        } else {
          $.toast(msg, 'forbidden')
          console.warn('获取购物车失败:' + msg)
        }
      }).catch((e) => {
        console.error('获取购物车失败:' + e)
      })
    },
    // 查找默认地址并返回索引
    addEach(obj) {
      let _this = this
      this.dataItems.forEach(function(item, index) {
        if (obj === 'defaultAdd') {  // 查找默认地址索引
          if (item.last_use === '1') {
            _this.checkState = index
            return
          }
        } else if (obj === 'deleteNull') { // 删除id为空的地址  暂时用///
          if (item.address_id === undefined) {
            _this.dataItems.splice(index, 1)
          }
        } else if (obj === 'saveOriginal') { // 保存初始收货地址
          _this.originalAddress['consignee_show_' + item.address_id] = _this.removeSpace(item.consignee)
          _this.originalAddress['region_show_' + item.address_id] = _this.removeSpace(item.region)
          _this.originalAddress['address_show_' + item.address_id] = _this.removeSpace(item.address)
          _this.originalAddress['zipcode_show_' + item.address_id] = ''
          _this.originalAddress['mobile_show_' + item.address_id] = _this.removeSpace(item.mobile)
        } else {  // 返回发送请求地址列表
          console.log(_this.removeSpace(item.consignee))
          _this.requestAddress['consignee_' + item.address_id] = _this.removeSpace(item.consignee)
          console.log('dao2222')
          _this.requestAddress['pcd_' + item.address_id] = _this.removeSpace(item.region)
          _this.requestAddress['address_' + item.address_id] = _this.removeSpace(item.address)
          _this.requestAddress['zipcode_' + item.address_id] = ''
          _this.requestAddress['mobile_' + item.address_id] = _this.removeSpace(item.mobile)
        }
      })
    },
    // 添加新地址状态改变
    newadd() {
      this.checkState = 'add'
      this.location = {
        id: '340000 340200 340208',
        name: '安徽省 芜湖市 三山区'
      }
    },
    // 判断是否为编辑状态
    editInfor() {
      this.editState = true
      this.location.name = this.dataItems[this.checkState].region
    },
    switchAdd(indexObj) {
      this.location.name = this.dataItems[indexObj].region
    },
    // 保存并下一步
    saveNext() {
      let validResult = ''
      if (this.checkState === 'add') {
        validResult = this.dataValid(this.newAddName, this.newAddProvince, this.newAddDetail, this.newAddTel)
        if (validResult) {
          var pro = this.newAddProvince.split('-')
          this.dataItems.push({
            address_id: '0',
            consignee: this.newAddName,
            region: this.newAddProvince,
            address: this.newAddDetail,
            mobile: this.newAddTel,
            country: 1,
            // country_name: pro[0],
            province_name: pro[1],
            city_name: pro[2],
            district_name: pro[3]
          })
          this.checkState = (this.dataItems.length - 1)  // 默认选择地址为最后一个
          this.xinzeng = false   // 当存在新增地址时隐藏新增按钮 默认只能显示一个
        }
      } else {
        let currentAdd = this.dataItems[this.checkState]
        validResult = this.dataValid(currentAdd.consignee, currentAdd.region, currentAdd.address, currentAdd.mobile)
        /*
        如果验证通过则执行地址赋值，否则。。。
        */
        if (validResult) {
          var existPro = this.dataItems[this.checkState].region.split('-')  // 拆分地址并分别赋值省市区
          var transObj = this.dataItems[this.checkState]   // 寻找目标地址
          // transObj.country_name = existPro[0]
          transObj.province_name = this.removeSpace(existPro[1])  // 省市区去除多余空格 否则会地址报错
          transObj.city_name = this.removeSpace(existPro[2])
          transObj.district_name = this.removeSpace(existPro[3])
        }
      }
      if (validResult) {
        let dataState = this.dataItems[this.checkState]
        let changeAdd = {
          country: 1,
          province: dataState.province_name,
          city: dataState.city_name,
          district: dataState.district_name,
          pcd: dataState.province_name + '-' + dataState.city_name + '-' + dataState.district_name,
          shipping: 4,
          is_pc: 1,
          step: this.oneBuyType
        }
        this.$http.post('flow.php?step=change_address', qs.stringify(changeAdd))
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            this.goodsDetail.total = data.total
            this.goodsDetail.order_price = data.order_price
            this.editState = false
          } else {
            $.toast(msg, 'forbidden')
          }
        }.bind(this))
        .catch(function(error) {
          console.log('catch' + error)
        })
      }
    },
    /*
    *地址删除操作
    *addressEach(objId) 通过address_id找到对应地址索引 删除
    */
    deleteAdd(objId) {
      if (confirm('是否确认删除当前收货地址')) {
        let _this = this
        this.addressEach(objId)
        // let delAdd = Object.assign(this.$parent.getBasicParam(), {
        //   address_id: objId
        // })
        this.$http.get('/flow.php?step=del_address', {
          params: {
            address_id: objId
          }
        })
        .then(function({data: {data, errcode, msg}}) {
          if (errcode === 0) {
            _this.dataItems.splice(_this.delIndex, 1)
            weui.toast('删除成功', 2000)
          } else {
            weui.toast(errcode + msg)
          }
        })
        .catch(function(error) {
          console.log('catch' + error)
        })
      }
      console.log('删除之后' + this.dataItems)
    },
    // 查找删除id所对应索引
    addressEach (indexObj) {
      let _this = this
      this.dataItems.forEach(function(item, index) {
        if (item.address_id === indexObj) {
          _this.delIndex = index
          return
        }
      })
    },
    /*
    * 提交订单
    */
    submitting () {
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
              step: 0
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
    payNow () {
      let orderList = ''
      // 遍历订单 获取所有订单号
      for (var i in this.orderInfor.order_all) { // 不使用过滤
        console.log(i, ':', this.orderInfor.order_all[i])
        orderList += this.orderInfor.order_all[i].order.order_id + ','
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
      this.$http.post('flow.php?step=make_big', qs.stringify(payParams))
      .then(function({data: {data, errcode, msg}}) {
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
                  zhis.$router.push({name: 'OrderList', params: {orderAct: 1}})
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
      })
      .catch(function(error) {
        console.log('error' + error)
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
  },
  created() { // 创建状态初始化
    // this.confirm(this.defaultVal)
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
.addFillIn .cell_box{ width:80%; }
</style>
