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
    connected: false,
    data: null
  },

  getters: {
    isConnected: function (state) {
      return state.connected
    },
    getData: function (state) {
      return state.data
    }
  },

  mutations: {

    connect: function (state) {
      state.connected = true
    },

    disconnect: function (state) {
      state.connected = false
    },

    update: function (state, data) {
      if (!state.data) state.data = {}
      state.data[data.key] = Object.assign({}, {...data, updated: Date.now()})
    }
  },

  actions: {

    monitor: function (context) {
      Socket.$on('closed', () => {
        this.dispatch('disconnect')
      })

      Socket.$on('data', (data) => {
        this.dispatch('update', data)
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
    },

    update: function (context, data) {
      context.commit('update', data)
      this.dispatch('OrderBook/setSummary')
    }

  }
})
