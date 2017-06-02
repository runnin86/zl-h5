<template>
<div>
  <div class="row yzg-title">
    <div class="col-xs-2 backBtn">
      <a @click="$parent.back()">
        <i class="iconfont-yzg icon-yzg-back"></i>
      </a>
    </div>
    <div class="col-xs-8 shop-name">
      <span>购物车</span>
    </div>
    <div class="col-xs-2 shop-bag">
      <router-link :to="{path: '/category'}">
        <span class="iconfont-yzg icon-yzg-goods"></span>
      </router-link>
    </div>
  </div>

  <div class="row cart-contain">
    <div class="goods-box">
      <div v-if="cartList.length!=0"
        class="weui-cells weui-cells_checkbox goods-box_title">
        <label class="weui-cell weui-check__label">
          <div class="weui-cell__hd">
            <input type="checkbox" class="weui-check"
              v-model="isSelectAll"
              @change="checkPro('all', $event)">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="weui-cell__bd">
            <p>全选</p>
          </div>
        </label>
      </div>
      <div v-if="cartList" v-for="(pro, key) in cartList" :key="pro.pid" class="goods-box_body">
        <div class="product-list">
          <div class="product-list_wrap">
            <div class="weui-cells weui-cells_checkbox product-list_checkbox">
              <label class="weui-cell weui-check__label">
                  <div class="weui-cell__hd">
                    <input type="checkbox" class="weui-check"
                      :checked="Boolean(parseFloat(pro.isCheck))"
                      @change="checkPro(pro.pid, $event)">
                    <i class="weui-icon-checked"></i>
                  </div>
                </label>
            </div>
            <div class="product-content">
              <div class="product-box">
                <div class="product-pic">
                  <img :src="img_domain + pro.img" width="80" height="80">
                </div>
                <div class="product-con">
                  <span style="display: block;height: 30px;overflow: hidden;font-size: 14px;">
                    {{pro.pName}}
                  </span>
                  <span style="display: block;height: 30px;overflow: hidden;font-size: 11px;">
                    {{pro.pDesc}}
                  </span>
                  <p class="cell-price" v-if="pro.price">￥&nbsp;{{pro.price}}</p>
                </div>
                <div class="product-option">
                  <div class="product-del">
                    <a @click="delCartById(pro.pid)">
                      <img src="static/images/del2.png">
                    </a>
                  </div>
                  <div class="product-num">
                    <a @click="updateCartNum(pro, -1)" class="num-reduce"></a>
                    <input :value="pro.num" type="tel" disabled="disabled"
                      min=1 max=9999 class="num-value" style="ime-mode:disabled;"
                      onKeyPress="if(event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;"
                      onKeyUp="this.value=this.value.replace(/\D/g,'')"/>
                    <a @click="updateCartNum(pro, 1)" class="num-add"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods-alert_title" v-show="showTips">
      <div class="goods-alert_pic">
        <img src="static/images/goods.png">
      </div>
      <div class="goods-alert_content">
        <p class="no-goods_cart">您的购物车空空如也</p>
        <router-link to="/category" class="random-stroll_shop">
          随便逛逛
        </router-link>
      </div>
    </div>
  </div>

  <div class="row cart-footer" v-if="cartList.length!=0">
    <div class="col-xs-12 layout-footer">
      <div class="weui-cells_checkbox checkAll">
        <label class="weui-cell">
            <div class="weui-cell__hd">
              <input type="checkbox" class="weui-check" v-model="isSelectAll"
                @change="checkPro('all', $event)">
              <i class="weui-icon-checked"></i>
            </div>
            <div class="weui-cell__bd">
              <p>全选</p>
            </div>
          </label>
      </div>
      <div class="checkout-info" style="text-align:center;margin-right:60px;">
        合计：<strong class="red" v-show="totalMoney>0"> ￥{{totalMoney}}</strong>
      </div>
      <a class="btn btn-checkout redBgColor" @click="checkoutCart()">
        去结算({{selectCounts}})
      </a>
    </div>
  </div>
</div>
</template>

<script>
import $ from 'zepto'
import qs from 'qs'
import weui from 'weui.js'
import Indicator from '../../../src/components/indicator'

export default {
  /*
   * 激活
   */
  activated() {
    this.cartList = []
    // 去获取购物车数据
    this.getCarts()
    // this.$store.commit('CHANGE_IS_INDEX', false)
  },
  /*
   * 页面取消激活
   */
  deactivated() {
    Indicator.close()
  },
  data() {
    return {
      cartList: [],
      showTips: false,
      isSelectAll: false,
      totalMoney: 0,
      selectCounts: 0,
      img_domain: 'http://img.zulibuy.com/images/'
    }
  },
  methods: {
    /*
     * 获取购物车数据
     * is_check->是否被选中结算(0：没有；1：是)
     */
    getCarts() {
      Indicator.open('加载中')
      // 设置总金额和总数目为0
      this.totalMoney = this.selectCounts = 0
      this.$http.get('cart/cartList', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        // console.log(data)
        if (code === 1) {
          if (data.length > 0) {
            this.showTips = false
          } else {
            this.showTips = true
          }
          // 计算总价和数量
          let checkCount = 0
          for (var i = 0; i < data.length; i++) {
            if (data[i].isCheck === 1) {
              checkCount++
              this.selectCounts += data[i].num
              this.totalMoney += parseFloat(data[i].num) * parseFloat(data[i].price)
            }
          }
          this.isSelectAll = (checkCount === data.length)
          console.log(this.isSelectAll)
          this.$parent.cartBadgeNum = this.selectCounts
          this.cartList = data
          // 获取购物车数量
          this.$store.dispatch('getCartNum')
        } else {
          $.toast(msg, 'forbidden')
          console.warn('获取购物车失败:' + msg)
        }
        Indicator.close()
      }).catch((e) => {
        Indicator.close()
        console.error('获取购物车失败:' + e)
      })
    },
    /*
     * 商品选择
     */
    checkPro(id, e) {
      let c = e.target.checked
      this.$http.get('cart/updateCartCheck', {
        params: {
          pid: id,
          check: Number(c)
        },
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        if (code === 1) {
          // 重新获取数据
          this.getCarts()
        } else {
          $.toast(msg, 'forbidden')
        }
      }).catch((e) => {
        console.error('商品选中状态更改失败:' + e)
      })
    },
    /*
     * 商品数量加减
     */
    updateCartNum(p, type) {
      let num = parseFloat(p.num) + type
      let pid = p.pid
      if (num > 0) {
        // 增加时去判断剩余数量
        this.$http.post('product/productDetail', qs.stringify({
          pid: pid
        })).then(({data: {data, code, msg}}) => {
          if (code === 1) {
            if (num > data.main.numbers) {
              weui.alert('库存不足，请选择其他商品')
            } else {
              // 发送更新购物车数量请求
              this.$http.get('cart/updateCartNum', {
                params: {
                  pid: pid,
                  num: type
                },
                headers: {
                  'x-token': window.localStorage.getItem('zlToken')
                }
              }).then(({data: {data, code, msg}}) => {
                if (code === 1) {
                  // 重新获取数据
                  this.getCarts()
                } else {
                  $.toast(msg, 'forbidden')
                }
              }, (response) => {
                // error callback
                console.log(response)
              })
            }
          }
        }, (response) => {
          // error callback
          console.error(response)
        })
      } else {
        // 友情提示
        weui.alert('购买最小数量为1')
      }
    },
    /*
     * 删除购物车商品
     */
    delCartById(rid) {
      weui.confirm('您确实要把该商品移出购物车吗?', () => {
        // 确认
        this.$http.delete('cart/delCart', {
          params: {
            pid: rid
          },
          headers: {
            'x-token': window.localStorage.getItem('zlToken')
          }
        }).then(({data: {data, code, msg}}) => {
          if (code === 1) {
            // 重新获取数据
            this.getCarts()
          } else {
            $.toast(msg, 'forbidden')
          }
        }, (response) => {
          // error callback
          console.log(response)
        })
      }, () => {
        // 取消
      })
    },
    /*
     * 结算
     */
    checkoutCart() {
      if (this.selectCounts === 0) {
        $.toast('没有选中商品', 'forbidden')
        return
      }
      this.$http.post('order/createOrder', {}, {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      })
      .then(({data: {data, code, msg}}) => {
        if (code === 1) {
          // console.log(data)
          this.$router.push({
            path: 'orderfill',
            query: {
              one_step_buy: 0
            }
          })
        } else {
          $.toast(msg, 'forbidden')
          console.error('结算商品失败:' + msg)
        }
      }, (response) => {
        // error callback
        console.log(response)
      })
    }
  },
  // 监听事件，当商品全部选中时，全选选中，否则不选中
  watch: {
    cartList: {
      handler: function(newVal, oldVal) {},
      deep: true
    }
  },
  beforeCreate() {
    // 组件实例刚刚被创建，属性都没有
  },
  created() {
    // 组件实例创建完毕，属性已经绑定
  },
  beforeMount() {
    // 模板编译之前
  },
  mounted() {
    // 模板编译之后，代替了之前的ready*
  },
  beforeUpdate() {
    // 组件更新之前
  },
  updated() {
    // 组件更新完毕
  },
  beforeDestroy() {
    // 组件销毁之前
  },
  destroyed() {
    // 组件销毁后
  }
}
</script>

<style>
.red {
  color: #ed3366;
}

.goods-alert_title {
  text-align: center;
}

.goods-alert_title .goods-alert_pic {
  width: 150px;
  margin: 40px auto 10px;
}

.goods-alert_title .goods-alert_pic img {
  width: 100%;
  margin: 0 auto;
}

.goods-alert_title .goods-alert_content .no-goods_cart {
  font-size: 18px;
  color: #666;
  margin-bottom: 5px;
}

.goods-alert_title .goods-alert_content .random-stroll_shop {
  padding: 5px 13px;
  border: 1px solid #666;
  border-radius: 4px;
  color: #000;
  font-size: 16px;
  line-height: 40px;
}

.cart-contain {
  margin-top: 44px;
  background: #eee
}

.goods-box {}

.goods-box .goods-box_title {
  background: #f6f6f6;
  margin-top: 10px;
}

.goods-box .goods-box_body {
  position: relative;
}

.goods-box .goods-box_body .product-list {
  display: -webkit-flex;
  display: flex;
  padding: 10px 30px 10px 15px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.goods-box .goods-box_title label {
  position: relative;
  margin-bottom: 0;
  padding: 3px 15px;
}

.goods-box .goods-box_body .uncheck-label:before,
.layout-footer .uncheck-label:before {
  content: "";
  width: 18px;
  height: 18px;
  background: transparent;
  border-radius: 50%;
  border: 1px solid #aaa;
  left: 0;
  top: 50%;
  margin-top: -9px;
  position: absolute;
}

.goods-box .checked-label:before,
.layout-footer .checked-label:before {
  content: "";
  width: 18px;
  height: 18px;
  background: #ef0021;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -9px;
  border: 1px solid #ef0021;
}

.goods-box .checked-label:after,
.layout-footer .checked-label:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 50%;
  margin-top: -3px;
  width: 9px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.goods-box .check-box,
.layout-footer .check-box {
  visibility: hidden;
}

.goods-box .goods-box_body .product-list_wrap {
  display: -webkit-flex;
  display: flex;
}

.goods-box .goods-box_body .product-list_wrap .product-box {
  display: -webkit-flex;
  display: flex;
}

.goods-box .goods-box_body .product-list_wrap .product-pic {
  margin-right: 10px;
}

.goods-box .goods-box_body .product-list_wrap .product-pic img {
  width: 80px;
}

.goods-box .goods-box_body .product-list_wrap .product-con .cell-price {
  padding-top: 0px;
  margin-bottom: 0;
  font-size: 14px;
  color: #ef0021;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-del {
  position: absolute;
  right: 0;
  top: 0;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-del img {
  width: 34px;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num {
  position: absolute;
  right: 15px;
  bottom: 10px;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce {
  margin: 0;
  float: left;
  width: 30px;
  height: 30px;
  text-align: center;
  display: block;
  border: none;
  background: #eee;
  border-radius: 0;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce:before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(/static/images/icon_detail.png) -86px -10px no-repeat;
  background-size: 100px 100px;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add {
  margin: 0;
  float: left;
  width: 30px;
  height: 30px;
  text-align: center;
  display: block;
  border: none;
  background: #eee;
  border-radius: 0;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add:before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(/static/images/icon_detail.png) -86px -28px no-repeat;
  background-size: 100px 100px;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-value {
  float: left;
  border: 0;
  width: 40px;
  font-size: 15px;
  color: #333;
  line-height: 30px;
  height: 30px;
  text-align: center;
}

.cart-footer {
  position: fixed;
  bottom: 58px;
  width: 100%;
  max-width: 640px;
  min-width: 320px;
}

.layout-footer {
  display: -webkit-flex;
  display: flex;
  height: 45px;
  line-height: 45px;
  background: #f8f8f8;
  padding-right: 0;
}

.layout-footer .checkAll {
  margin-right: 10px;
  margin-top: 0;
  align-self: center;
}

.layout-footer label {
  position: relative;
  margin-bottom: 2px;
  padding: 0;
  opacity: inherit;
}

.layout-footer .checkout-info {
  -webkit-flex: 1;
  flex: 1;
}

.layout-footer .checkout-info .price {
  color: #ed3366;
  font-weight: 700;
  font-size: 15px;
}

.layout-footer .btn-checkout {
  display: block;
  background: #ed3366;
  color: #fff;
  align-self: center;
}

.btn-checkout {
  padding: 0 12px;
  border-radius: 0;
}

.weui-cells_checkbox .weui-icon-checked:before {
  font-size: 18px;
}

.goods-box .weui-cell__bd p,
.layout-footer .weui-cell__bd p {
  font-size: 14px;
  padding-top: 2px;
}

.cart-contain .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before,
.layout-footer .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before {
  color: #ed3366;
}

.goods-box .goods-box_body .product-list_wrap .product-list_checkbox {
  align-self: center;
  margin-top: 0;
}

.goods-box .goods-box_body .product-list_checkbox label {
  padding: 0;
}

.cart-contain .weui-check__label:active,
.layout-footer .weui-check__label:active {
  background: none;
}

.cart-contain .weui-cells {
  overflow: initial;
}

.cart-contain .weui-cells:before,
.cart-contain .weui-cells:after,
.layout-footer .weui-cells:before,
.layout-footer .weui-cells:after {
  border: none;
}
</style>
