// import api from '../api/shop'

// initial state
import util from './../../utils'

const state = {
  user: null,
  token: null
}

// getters
const getters = {
  userInfo: state => JSON.parse(util.getStore('zlUser')),
  token: state => util.getStore('zlToken')
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
  LOGOUT (state) {
    state = null
    util.removeStore('zlUser')
    util.removeStore('zlToken')
  },

  SET_USER (state, userData) {
    // 将用户信息存储至localStorage
    util.setStore('zlUser', userData)
  },

  SET_TOKEN (state, token) {
    // 将卖家ID存储至localStorage
    util.setStore('zlToken', token)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
