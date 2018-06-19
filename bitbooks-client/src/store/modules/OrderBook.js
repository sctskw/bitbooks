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
          bids: {
            count: 0,
            volume: 0
          },
          asks: {
            count: 0,
            volume: 0
          }
        }

        let bids = Object.keys(exchange.bids)
        let asks = Object.keys(exchange.asks)

        let bidVolume = Math.ceil(bids.reduce(function (sum, key) {
          sum += parseFloat(exchange.bids[key])
          return sum
        }, struct.bids.volume))

        let askVolume = Math.ceil(asks.reduce(function (sum, val) {
          sum += parseFloat(exchange.asks[val])
          return sum
        }, struct.asks.volume))

        struct.bids = {
          count: bids.length,
          volume: bidVolume
        }

        struct.asks = {
          count: asks.length,
          volume: askVolume
        }

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
          bids: { count: 0, volume: 0 },
          asks: { count: 0, volume: 0 }
        }
      }

      // TODO: refactor this
      for (let ex in db) {
        let data = db[ex].data
        let totals = context.getters.getTotals(data)

        results[ex] = totals

        // keep track of true totals
        results.totals.bids.count += totals.bids.count
        results.totals.bids.volume += totals.bids.volume
        results.totals.asks.count += totals.asks.count
        results.totals.asks.volume += totals.asks.volume
      }

      context.commit('setSummary', results)
    }
  }

}
