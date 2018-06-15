import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    connected: false
  },

  mutations: {

    connect: function (state) {
      debugger
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
