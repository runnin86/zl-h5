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
        <router-link :to="{ name: 'Index',path: '/index'}">
          <span class="iconfont-yzg icon-yzg-goods"></span>
        </router-link>
      </div>
    </div>

    <div class="row cart-contain">
      <div class="goods-box" v-if="goods_list" v-for="(g, key) in goods_list" :key="g.id">
        <div class="weui-cells weui-cells_checkbox goods-box_title">
          <label class="weui-cell weui-check__label">
            <div class="weui-cell__hd">
              <input type="checkbox" class="weui-check"
                v-model="g.is_suppliers_select_all"
                @change="selectCarts(key, 0, $event)">
              <i class="weui-icon-checked"></i>
            </div>
            <div class="weui-cell__bd">
              <p>{{g.suppliers}}</p>
            </div>
          </label>
        </div>
        <div v-for="pro in g.data" class="goods-box_body">
          <div class="product-list">
            <div class="product-list_wrap">
              <div class="weui-cells weui-cells_checkbox product-list_checkbox">
                <label class="weui-cell weui-check__label">
                  <div class="weui-cell__hd">
                    <input type="checkbox" class="weui-check"
                      :checked="!Boolean(parseFloat(pro.is_uncheckout))"
                      @change="selectCarts(pro.rec_id, 1, $event)">
                    <i class="weui-icon-checked"></i>
                  </div>
                </label>
              </div>
              <div class="product-content">
                <div class="product-box">
                  <div class="product-pic">
                    <img :src="img_domain + pro.goods_thumb" alt="">
                  </div>
                  <div class="product-con">
                    <span class="product-title">{{pro.goods_name}}</span>
                    <p class="cell-price">{{pro.goods_price}}</p>
                  </div>
                  <div class="product-option">
                    <div class="product-del">
                      <a @click="delCartById(pro.rec_id)">
                        <img src="static/images/del2.png">
                      </a>
                    </div>
                    <div class="product-num">
                      <a @click="updateCartNum(pro, -1)" class="num-reduce"></a>
                      <input :value="pro.goods_number" v-on:blur='inputCartNum(pro, $event)'
                          type="tel" min=1 max=9999 class="num-value" style="ime-mode:disabled;"
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

    <div class="row cart-footer" v-if="goods_list.length!=0">
      <div class="col-xs-12 layout-footer">
        <div class="weui-cells weui-cells_checkbox checkAll">
          <label class="weui-cell weui-check__label">
            <div class="weui-cell__hd">
              <input type="checkbox" class="weui-check" v-model="this.is_select_all"
                @change="selectCarts(null, 2, $event)">
              <i class="weui-icon-checked"></i>
            </div>
            <div class="weui-cell__bd">
              <p>全选</p>
            </div>
          </label>
        </div>
        <div class="checkout-info" v-html="this.shopping_money"></div>
        <a class="btn btn-checkout redBgColor" @click="checkoutCart()">去结算({{total.real_goods_count}})</a>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import weui from 'weui.js'
import Indicator from '../../../src/components/indicator'

export default {
  /*
   * 激活
   */
  activated () {
    // 去获取购物车数据
    this.getCarts()
    this.$store.commit('CHANGE_IS_INDEX', false)
  },
  /*
   * 页面取消激活
   */
  deactivated() {
    Indicator.close()
  },
  data () {
    return {
      goods_list: [],
      is_select_all: false,
      total: [],
      shopping_money: '',
      showTips: false,
      img_domain: ''
    }
  },
  methods: {
    /*
     * 获取购物车数据
     * is_uncheckout->是否被选中结算(0：没有；1：是)
     */
    getCarts() {
      Indicator.open('加载中')
      this.$http.get('flow.php', {
        params: {
          step: 'cart'
        }
      })
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // console.log(data)
          if (Object.keys(data.goods_list).length > 0) {
            this.showTips = false
          } else {
            this.showTips = true
          }
          this.goods_list = data.goods_list
          this.total = data.total
          this.is_select_all = data.is_select_all
          this.shopping_money = data.shopping_money
          this.img_domain = data.img_domain
        } else {
          console.error('获取购物车失败:' + msg)
        }
        Indicator.close()
      }, (response) => {
        // error callback
        console.error(response)
        Indicator.close()
      })
    },
    /*
     * 商品选择
     */
    selectCarts(id, type, e) {
      // op->
      // 全选/全不选：all_checkout/all_uncheckout,此时不用传第一个参数；
      // 单选/单不选：single_checkout/single_uncheckout；
      // 供应商选择/供应商取消选择：suppliers_checkout/suppliers_uncheckout，此时第一个参数传0
      let c = e.target.checked
      let op = ''
      if (type === 0) {
        // 供应商
        op = (c ? 'suppliers_checkout' : 'suppliers_uncheckout')
      } else if (type === 1) {
        // 单个
        op = (c ? 'single_checkout' : 'single_uncheckout')
      } else if (type === 2) {
        // 全部
        op = (c ? 'all_checkout' : 'all_uncheckout')
      }
      // op不为空才去发送请求
      if (op) {
        this.$http.get('flow.php', {
          params: {
            step: 'select_cart_goods',
            id: id, // 商品ID
            op: op
          }
        }).then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            // console.log(data)
            // 重新获取数据
            this.getCarts()
          } else {
            console.error('商品选择失败:' + msg)
          }
        }, (response) => {
          // error callback
          console.log(response)
        })
      }
    },
    /*
     * 商品数量输入
     */
    inputCartNum(p, e) {
      let validAmount = 0
      if (e.target.value > 0) {
        validAmount = parseFloat(e.target.value)
      } else if (e.target.value === '' || parseFloat(e.target.value) === 0) {
        e.target.value = 1
        validAmount = 1
      }
      this.submiUpdateCartNum(p.rec_id, validAmount)
    },
    /*
     * 商品数量加减
     */
    updateCartNum(p, type) {
      let num = parseFloat(p.goods_number) + type
      this.submiUpdateCartNum(p.rec_id, num)
    },
    /*
     * 商品数量加减
     */
    submiUpdateCartNum(rid, num) {
      // 发送请求
      let postData = {
        rec_id: rid,
        goods_number: num
      }
      this.$http.post('/flow.php?step=update_cart_number', qs.stringify(postData))
      .then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // console.log(data)d
          if (data.message !== 1) {
            // 友情提示
            weui.alert(data.message)
          }
          // 重新获取数据
          this.getCarts()
        } else {
          console.error('商品数量更新失败:' + msg)
        }
        // 重新获取数据
        this.getCarts()
      }, (response) => {
        // error callback
        console.log(response)
      })
    },
    /*
     * 删除购物车商品
     */
    delCartById(rid) {
      weui.confirm('您确实要把该商品移出购物车吗?', () => {
        // 确认
        this.$http.get('flow.php', {
          params: {
            step: 'drop_goods',
            id: rid // 商品ID
          }
        }).then(({data: {data, errcode, msg}}) => {
          if (errcode === 0) {
            console.log(data)
          } else {
            console.error('删除商品失败:' + msg)
          }
          // 重新获取数据
          this.getCarts()
          // 获取购物车数量
          this.$store.dispatch('getCartNum')
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
      this.$http.get('flow.php', {
        params: {
          step: 'checkout',
          code: 1
        }
      }).then(({data: {data, errcode, msg}}) => {
        if (errcode === 0) {
          // console.log(data)
          this.$router.push({path: 'orderfill', query: { one_step_buy: 0 }})
        } else {
          console.error('结算商品失败:' + msg)
        }
        // 重新获取数据
        this.getCarts()
      }, (response) => {
        // error callback
        console.log(response)
      })
    }
  },
  // 监听事件，当商品全部选中时，全选选中，否则不选中
  watch: {
    goods_list: {
      handler: function (newVal, oldVal) {
      },
      deep: true
    }
  },
  beforeCreate () {
    // 组件实例刚刚被创建，属性都没有
  },
  created () {
    // 组件实例创建完毕，属性已经绑定
  },
  beforeMount () {
    // 模板编译之前
  },
  mounted () {
    // 模板编译之后，代替了之前的ready*
  },
  beforeUpdate () {
    // 组件更新之前
  },
  updated () {
    // 组件更新完毕
  },
  beforeDestroy () {
    // 组件销毁之前
  },
  destroyed () {
    // 组件销毁后
  }
}
</script>

<style>
.red{color:#ed3366;}
.goods-alert_title{
  text-align: center;
}
.goods-alert_title .goods-alert_pic{
  width:150px;
  margin:40px auto 10px;
}
.goods-alert_title .goods-alert_pic img{
  width:100%;
  margin:0 auto;
}
.goods-alert_title .goods-alert_content .no-goods_cart{
  font-size: 18px;
  color: #666;
  margin-bottom: 5px;
}
.goods-alert_title .goods-alert_content .random-stroll_shop{
  padding: 5px 13px;
  border: 1px solid #666;
  border-radius: 4px;
  color: #000;
  font-size: 16px;
  line-height: 40px;
}
.cart-contain { margin-top: 44px; background: #eee}
.goods-box {}
.goods-box .goods-box_title { background: #f6f6f6;margin-top:10px; }
.goods-box .goods-box_body { position: relative; }
.goods-box .goods-box_body .product-list { display: -webkit-flex; display: flex; padding: 10px 30px 10px 15px; border-bottom: 1px solid #eee; background: #fff; }
.goods-box .goods-box_title label{ position: relative;margin-bottom:0;padding:3px 15px; }
.goods-box .goods-box_body .uncheck-label:before,.layout-footer .uncheck-label:before { content: ""; width: 18px; height: 18px; background: transparent; border-radius: 50%; border: 1px solid #aaa; left: 0; top: 50%; margin-top: -9px; position: absolute; }
.goods-box .checked-label:before,.layout-footer .checked-label:before { content: ""; width: 18px; height: 18px; background: #ef0021; border-radius: 50%; position: absolute; left: 0; top: 50%; margin-top: -9px; border: 1px solid #ef0021;}
.goods-box .checked-label:after,.layout-footer .checked-label:after  { content: ''; position: absolute; left: 5px; top: 50%; margin-top: -3px; width: 9px; height: 5px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); transform: rotate(-45deg); }
.goods-box .check-box ,.layout-footer .check-box{ visibility: hidden; }
.goods-box .goods-box_body .product-list_wrap { display: -webkit-flex; display: flex; }
.goods-box .goods-box_body .product-list_wrap .product-box { display: -webkit-flex; display: flex;}
.goods-box .goods-box_body .product-list_wrap .product-pic { margin-right: 10px; }
.goods-box .goods-box_body .product-list_wrap .product-pic img { width: 80px; }
.goods-box .goods-box_body .product-list_wrap .product-con .product-title { display: block; height: 40px; overflow: hidden; font-size: 13px; }
.goods-box .goods-box_body .product-list_wrap .product-con .cell-price { padding-top: 20px; margin-bottom: 0; font-size: 13px; color: #ef0021; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-del { position: absolute; right: 0; top: 0; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-del img { width: 34px; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-num { position: absolute; right: 15px; bottom: 10px; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce { margin:0;float: left; width: 30px; height: 30px; text-align: center; display: block; border: none; background: #eee; border-radius: 0; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-reduce:before { content: ""; display: inline-block; width: 15px; height: 20px; background: url(/static/images/icon_detail.png) -86px -10px no-repeat; background-size: 100px 100px; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add {margin:0;float: left; width: 30px; height: 30px; text-align: center; display: block; border: none; background: #eee; border-radius: 0; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-add:before { content: ""; display: inline-block; width: 15px; height: 20px; background: url(/static/images/icon_detail.png) -86px -28px no-repeat; background-size: 100px 100px; }
.goods-box .goods-box_body .product-list_wrap .product-option .product-num .num-value { float: left; border: 0; width: 40px; font-size: 15px; color: #333; line-height: 30px; height: 30px; text-align: center; }
.cart-footer{position: fixed;bottom:0;width:100%;max-width: 640px;min-width: 320px;}
.layout-footer{display: -webkit-flex;display: flex;height:45px;line-height: 45px;background:#f8f8f8; padding-right: 0; }
.layout-footer .checkAll{margin-right:10px;margin-top:0;align-self: center;}
.layout-footer label{ position: relative;margin-bottom:0;padding:0; }
.layout-footer .checkout-info{-webkit-flex:1;flex:1;}
.layout-footer .checkout-info .price{color:#ed3366;font-weight: 700;font-size:15px;}
.layout-footer .btn-checkout{display: block;background: #ed3366;color:#fff;align-self:center;}
.btn-checkout{ padding: 0 12px; border-radius:0;}
.weui-cells_checkbox .weui-icon-checked:before{font-size:18px;}
.goods-box .weui-cell__bd p,.layout-footer .weui-cell__bd p{font-size:14px; padding-top: 2px;}
.cart-contain .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before,.layout-footer .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before{color:#ed3366;}
.goods-box .goods-box_body .product-list_wrap .product-list_checkbox{align-self: center;margin-top:0;}
.goods-box .goods-box_body .product-list_checkbox label{padding:0;}
.cart-contain .weui-check__label:active,.layout-footer .weui-check__label:active{background:none;}
.cart-contain .weui-cells{overflow: initial;}
.cart-contain .weui-cells:before,.cart-contain .weui-cells:after,.layout-footer .weui-cells:before,.layout-footer .weui-cells:after{border:none;}

</style>
