import axios from 'axios'
// import {baseParam} from '../getters.js'

export default {
  getCartNum(cb) {
    axios.get('cart/cartList').then(({data: {data, code, msg}}) => {
      console.log(data)
      if (code === 1) {
        // 获取购物车数据,回调给调用者
        cb(data)
      } else {
        console.warn('获取购物车失败:' + msg)
      }
    }, (response) => {
      // error callback
      console.error(response)
    })
  }
}
