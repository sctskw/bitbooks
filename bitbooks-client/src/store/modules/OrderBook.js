// @store OrderBook

export default {

  // NOTE: this does not derive the name, just a nice hint in code
  name: 'OrderBook',

  namespaced: true,

  state: {
    summary: false,
    orders: false // wait for them to load
  },

  getters: {
    getLastUpdated: function (state) {
      return new Date()
    },
    getSummary: function (state) {
      return state.summary
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
    },

    getOrderBook: function () {
      return function (exchange) {
        let data = exchange.data

        function sort (items) {
          // Sort list just in case
          return items.sort(function (a, b) {
            if (a.value > b.value) return 1
            return (a.value < b.value) ? -1 : 0
          })
        }

        function flatten (items) {
          return sort(Object.keys(items)
            .reduce(function (memo, volume) {
              let vol = parseFloat(items[volume]).toFixed(8)
              let val = parseFloat(volume).toFixed(8)

              memo.push({
                volume: vol,
                value: val
              })

              return memo
            }, []))
        }

        let bids = flatten(data.bids).reverse()
        let asks = flatten(data.asks)

        return { bids, asks }
      }
    }
  },

  mutations: {
    setSummary: function (state, data) {
      state.summary = data
    },
    setOrders: function (state, data) {
      state.orders = data
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
    },

    setOrders: function (context) {
      let db = this.state.data
      let orders = {}

      for (let ex in db) {
        orders[ex] = context.getters.getOrderBook(db[ex])
      }

      context.commit('setOrders', orders)
    }
  }

}
