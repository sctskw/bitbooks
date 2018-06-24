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
    updated: 0,
    data: null
  },

  getters: {
    isConnected: function (state) {
      return state.connected
    },
    getLastUpdated: function (state) {
      return state.updated
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

      const now = Date.now()

      state.data[data.key] = Object.assign({}, {...data, updated: now})
      state.updated = now
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
      let refresh = (Date.now() - parseInt(this.state.updated)) > 10000

      // check last time we updated so we don't spam
      if (!refresh) return false

      // console.log(`last updated: ${new Date(this.state.updated)}`)

      // commit the new data changes
      context.commit('update', data)

      // TODO: should these be listened for on the OrderBook?
      this.dispatch('OrderBook/setSummary')
      this.dispatch('OrderBook/setOrders')
    }

  }
})
