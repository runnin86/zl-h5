<template>
<div>
  <!-- <wv-header title="购物车" @leftClick="$parent.back()"></wv-header> -->

  <div class="row cart-contain" style="overflow: hidden; margin-top:-7px">
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
      <div v-if="cartList" v-for="(pro, key) in cartList" :key="pro.pid"
        ref="child" :id="pro.pid" :class="[{swipeleft: swipeId === pro.pid},'goods-box_body']">
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
                  <img :src="$parent.imgBase64" :style="'background-image:url(' + img_domain + pro.img + ')'">
                </div>
                <div class="product-con">
                  <span class="product-title">{{pro.pName}}</span>
                  <p style="color:#999; font-size:12px">{{pro.pDesc}}</p>
                  <p class="cell-price">￥&nbsp;{{pro.price}}</p>
                </div>
                <div class="product-option">
                  <div class="product-num">
                    <a @click="updateCartNum(pro, -1)" class="num-reduce"></a>
                    <input :value="pro.num" disabled="disabled"
                      type="tel" min=1 max=9999 class="num-value" style="ime-mode:disabled;"
                      onKeyPress="if(event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;"
                      onKeyUp="this.value=this.value.replace(/\D/g,'')"
                    />
                    <a @click="updateCartNum(pro, 1)" class="num-add"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="delete shanchu" @click.stop="delCartById(pro.pid)">删除</div>
        </div>
      </div>
    </div>
    <div class="goods-alert_title" v-show="showTips">
      <div class="goods-alert_pic">
        <img src="static/images/noGoods.png">
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
        <label class="weui-cell weui-check__label">
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
      <div class="checkout-info">
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

let loading
export default {
  /*
   * 激活
   */
  activated() {
    this.$store.commit('CHANGE_IS_INDEX', false)
    this.$parent.setTitle('购物车')

    // 去获取购物车数据
    this.cartList = []
    this.getCarts()

    this.swipeId = null
    this.initSwpipeDelete()
  },
  /*
   * 页面取消激活
   */
  deactivated() {
    loading.close()
  },
  data() {
    return {
      cartList: [],
      swipeId: null,
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
      loading = weui.loading('加载中')
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
          console.log(this.isSelectAll, this.totalMoney)
          this.$parent.cartBadgeNum = this.selectCounts
          this.cartList = data
          // 获取购物车数量
          this.$store.dispatch('getCartNum')
        } else {
          $.toast(msg, 'forbidden')
          console.warn('获取购物车失败:' + msg)
        }
        loading.hide()
      }).catch((e) => {
        loading.hide()
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
        // 去执行删除
        if (num === 0) {
          this.delCartById(pid)
        }
      }
    },
    /*
     * 删除购物车商品
     */
    delCartById(pid) {
      weui.confirm('您确实要把该商品移出购物车吗?', () => {
        // 确认
        this.$http.delete('cart/delCart', {
          params: {
            pid: pid
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
      this.$router.push({
        path: 'orderfill',
        query: {
          step: 'checkout'
        }
      })
    },
    // 初始化左滑删除
    initSwpipeDelete() {
      setTimeout(() => {
        // 判断是否存在信息列表
        if (this.$refs.child) {
          this.$refs.child.forEach((element, index) => {
            let x, y, X, Y, swipeX, swipeY
            // 监听touchstart
            element.addEventListener('touchstart', e => {
              x = e.changedTouches[0].pageX
              y = e.changedTouches[0].pageY
              swipeX = true
              swipeY = true
            })
            element.addEventListener('touchmove', e => {
              X = event.changedTouches[0].pageX
              Y = event.changedTouches[0].pageY
              if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                // 阻止默认事件
                e.stopPropagation()
                // 右滑
                if (X - x > 10) {
                  e.preventDefault()
                  this.swipeId = null
                }
                // 左滑
                if (x - X > 10) {
                  e.preventDefault()
                  // 赋值滑动行的upc_id为需要滑动删除的
                  this.swipeId = element.id
                }
                swipeY = false
              }
              if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false
              }
            })
          })
        }
      }, 1000)
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
  color: #c61336;
}
</style>
<style scoped>

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
  font-size: 0.6837;
  color: #999;
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
  /*padding-top: 44px;*/
}

.goods-box {}

.goods-box .goods-box_title {
  background: #fff;
  margin-top: 7px;
  border-bottom: 1px solid #eee
}

.goods-box .goods-box_body {
  position: relative;
  width: 100%;
  transition: all 0.3s linear;
}

.goods-box .goods-box_body .product-list {
  display: -webkit-flex;
  display: flex;
  padding: 10px 1.3461rem 0.2rem 0.641rem;
  background: #fff;
  height: 5.2rem
}

.goods-box .goods-box_body:before {
  position: absolute;
  content: '';
  height: 1px;
  width: 14rem;
  background: #ddd;
  bottom: 0;
  right: 0
}

.goods-box .goods-box_body:last-child:before {
  background: none
}

.goods-box .goods-box_title label {
  position: relative;
  margin-bottom: 0;
  padding: 0.5rem 15px;
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
  margin-right: 0.2137rem;
  flex: none;
}

.goods-box .goods-box_body .product-list_wrap .product-pic img {
  width: 4.4rem;
  height: 4.4rem;
  background-size: cover;
}

.goods-box .goods-box_body .product-list_wrap .product-con {
  flex: auto;
}

.goods-box .goods-box_body .product-list_wrap .product-con .product-title {
  display: block;
  height: 40px;
  overflow: hidden;
  font-size: 13px;
}

.goods-box .goods-box_body .product-list_wrap .product-con .cell-price {
  font-size: 0.598rem;
  color: #c61336;
  position: absolute;
  bottom: 0.4rem;
  font-weight: bold
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
  border: 1px solid #999;
  width: 4.424rem;
  height: 1.15rem;
  line-height: 0.5rem; overflow: hidden
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce {
  margin: 0;
  text-align: left;
  display: block;
  border: none;
  border-radius: 0;
  position: absolute;
  top: 0px;
  left: 0;
  width: 1.25rem;
  padding-left: 0.213rem;
  padding-top: 0.213rem;
  border-right: 1px solid #999;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce:before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(/static/images/icon_detail.png) -84px -16px no-repeat;
  background-size: 100px 100px;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add {
  margin: 0;
  text-align: center;
  display: block;
  border: none;
  border-radius: 0;
  position: absolute;
  right: 0;
  top: 0px;
  width: 1.25rem;
  text-align: right;
  padding-right: 0.213rem;
  padding-top: 0.213rem;
  border-left: 1px solid #999;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add:before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 20px;
  background: url(/static/images/icon_detail.png) -86px -35px no-repeat;
  background-size: 100px 100px;
}

.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-value {
  border: 0;
  width: 40px;
  font-size: 0.512rem;
  color: #333;
  outline: none;
  text -align: center;
  border-radius: 10px;
  margin-left: 1.28rem;
  margin-top: 0.3rem;
  text-align: center;
  font-family: '微软雅黑'
}

.cart-footer {
  position: fixed;
  bottom: 0;
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
  margin-bottom: 0;
  padding: 0;
}

.layout-footer .checkout-info {
  -webkit-flex: 1;
  flex: 1; text-align: right; padding-right: 0.4rem
}
.layout-footer .checkout-info .price {
  color: #ed3366;
  font-weight: 700;
  font-size: 15px;
}

.layout-footer .btn-checkout {
  display: block;
  background: #c61336;
  color: #fff;
  align-self: center;
  width: 5.5rem
}

.btn-checkout {
  padding: 0 12px;
  border-radius: 0;
}

.weui-cells {
  background-color: transparent;
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
  color: #333;
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

.goodsNum {
  position: absolute;
  right: 15px;
  bottom: 15px
}

.shop-bag a {
  color: #333
}

.shop-bag a:hover,
.shop-bag a:active {
  color: #333;
}

.shop-bag a p {
  text-align: center
}

.shanchu {
  position: absolute;
  text-align: center;
  top: 0;
  letter-spacing: 4px;
  text-indent: 4px;
  right: -3.16rem;
  z-index: 1;
  height: 5.2rem;
  padding-top: 2.147rem;
  width: 3.073rem;
  background: #333;
  color: #fff;
}

.swipeleft {
  transform: translateX(-20%)
}
@media screen and (max-width:320px) {
  .goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-value{
    margin-top: 0.25rem;
    margin-left: 1.18rem;
  }
  .goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add,.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce{
    padding-top: 0.113rem;
  }
}
@media screen and (min-width:412px) {
  .goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-value{
    margin-top: 0.25rem;
    margin-left: 1.38rem;
  }
  .goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add,.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce{
    padding-top: 0.3rem;
  }
  .goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add:before {
    content: "";
    display: inline-block;
    width: 15px;
    height: 20px;
    background: url(/static/images/icon_detail.png) -88px -36px no-repeat;
    background-size: 100px 100px;
  }
  .goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce:before {
    content: "";
    display: inline-block;
    width: 15px;
    height: 20px;
    background: url(/static/images/icon_detail.png) -84px -18px no-repeat;
    background-size: 100px 100px;
  }
}
.cart-contain .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before, .layout-footer .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before{color: #e45773}
</style>
