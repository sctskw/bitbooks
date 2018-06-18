// @store OrderBook

export default {

  // NOTE: this does not derive the name, just a nice hint in code
  name: 'OrderBook',

  namespaced: true,

  state: {
    updated: null,
    orders: false // wait for them to load
  },

  getters: {
    getSummary: function (state) {
      return state.orders
    },
    getLastUpdated: function (state) {
      return new Date(state.updated).toString()
    }
  },

  actions: {

    // TODO: make this work with Sockets/API
    getOrders: function (context) {
      setTimeout(() => {
        context.commit('setOrders', {
          totals: {
            asks: Math.floor(Math.random() * 100),
            bids: Math.floor(Math.random() * 100)

          }
        })
      }, 2000)
    }
  },

  mutations: {

    setOrders: function (state, orders) {
      state.orders = orders
      state.updated = Date.now()
    }

  }

}
