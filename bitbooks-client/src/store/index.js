import Vue from 'vue'
import Vuex from 'vuex'

import OrderBook from './modules/OrderBook.js'
import Exchanges from './modules/Exchanges.js'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    OrderBook,
    Exchanges
  },

  state: {
    connected: false
  },

  mutations: {

    connect: function (state) {
      state.connected = true
    },

    disconnect: function (state) {
      state.connected = false
    }

  },

  actions: {

    connect: function (context) {
      context.commit('connect')
    },

    disconnect: function (context) {
      context.commit('disconnect')
    }

  }
})
