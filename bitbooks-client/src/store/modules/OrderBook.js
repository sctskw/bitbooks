// @store OrderBook

export default {

  // NOTE: this does not derive the name, just a nice hint in code
  name: 'OrderBook',

  namespaced: true,

  state: {
    updated: null,
    summary: false,
    orders: false // wait for them to load
  },

  getters: {
    getSummary: function (state) {
      return state.summary
    },
    getLastUpdated: function (state) {
      return new Date(state.updated).toString()
    },
    getOrders: function (state, getters, rootState) {
      return state.orders
    },
    getTotals: function () {
      // NOTE: returning as a function allows custom params
      return function (exchange) {
        let struct = {
          bids: 0,
          asks: 0
        }

        let bids = Object.keys(exchange.bids)
        let asks = Object.keys(exchange.asks)

        struct.bids = Math.ceil(bids.reduce(function (sum, key) {
          sum += parseFloat(exchange.bids[key])
          return sum
        }, struct.bids))

        struct.asks = Math.ceil(asks.reduce(function (sum, val) {
          sum += parseFloat(exchange.asks[val])
          return sum
        }, struct.asks))

        return struct
      }
    }
  },

  mutations: {
    setSummary: function (state, data) {
      state.summary = data
    }
  },

  actions: {

    setSummary: function (context) {
      let db = this.state.data

      let results = {
        totals: {
          bids: 0,
          asks: 0
        }
      }

      // TODO: refactor this
      for (let ex in db) {
        let data = db[ex].data
        let totals = context.getters.getTotals(data)

        results[ex] = totals

        // keep track of true totals
        results.totals.bids += totals.bids
        results.totals.asks += totals.asks
      }

      context.commit('setSummary', results)
    }
  }

}
