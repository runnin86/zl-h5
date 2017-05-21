// import api from '../api/shop'

// initial state
import util from './../../utils'

const state = {
  user: util.getStore('user_nhh')
}

// getters
const getters = {
  userInfo: state => JSON.parse(util.getStore('user_nhh')),
  sellerId: state => util.getStore('seller_id_nhh')
}

// actions(异步)
const actions = {
  removeUser({commit}) {
    commit('REMOVE_USER')
  },
  getUser({commit}) {
    // api.getUser(data => {
    //   commit('GET_USER', {data})
    // })
  }
}

// mutations(同步)
const mutations = {
  REMOVE_USER (state) {
    util.removeStore('user_nhh')
  },

  SET_USER (state, userData) {
    // 将用户信息存储至localStorage
    util.setStore('user_nhh', userData)
  },

  SET_SELLER_ID (state, sid) {
    // 将卖家ID存储至localStorage
    util.setStore('seller_id_nhh', sid)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
