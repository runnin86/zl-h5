import axios from 'axios'

export default {
  getCartNum(cb) {
    if (window.localStorage.getItem('zlUser')) {
      axios.get('cart/cartList', {
        headers: {
          'x-token': window.localStorage.getItem('zlToken')
        }
      }).then(({data: {code, data, msg}}) => {
        // console.log(data)
        if (code === 1) {
          // 获取购物车数据,回调给调用者
          cb(data)
        } else {
          cb(null)
        }
      }).catch((e) => {
        console.error('获取购物车失败:' + e)
      })
    }
  }
}
