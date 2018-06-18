import Vue from 'vue'
import Vuex from 'vuex'

import Socket from '@/socket'
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

  getters: {
    isConnected: function (state) {
      return state.connected
    }
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

    monitor: function (context) {
      Socket.$on('closed', () => {
        this.dispatch('disconnect')
      })

      this.dispatch('connect')
    },

    connect: function (context) {
      Socket.connect(() => {
        context.commit('connect')
      })
    },

    disconnect: function (context) {
      Socket.disconnect()
      context.commit('disconnect')
    }

  }
})
