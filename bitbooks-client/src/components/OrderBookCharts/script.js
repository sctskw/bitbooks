import { mapGetters } from 'vuex'
import Chart from './chart.js'

export default {

  name: 'OrderBookCharts',

  props: {
    chart: null
  },

  computed: {
    ...mapGetters({
      connected: 'isConnected'
    }),
    ...mapGetters({
      orders: 'getOrders'
    })
  },

  methods: {

    ...mapGetters(['isConnected']),

    ...mapGetters('OrderBook', ['getOrders']),

    getData: function (exchanges) {
      let results = {
        bids: {},
        asks: {}
      }

      function group (exchange, items) {
        return items.reduce(function (memo, item) {
          let key = item.value.toString()

          if (!memo[key]) memo[item.value] = {}
          if (!memo[key][exchange]) memo[key][exchange] = []

          memo[key][exchange].push(Object.assign({
            // copy the exchange over for later visual sorting
            exchange: exchange
          }, item))

          return memo
        }, {})
      }

      function merge (dest, origin) {
        for (let key in origin) {
          if (origin[key] instanceof Array) {
            if (!dest[key]) dest[key] = []
            dest[key] = dest[key].concat(origin[key])
          }
          if (origin[key] instanceof Object) {
            dest[key] = merge(dest[key] || {}, origin[key])
          }
        }

        return dest
      }

      // NOTE: the chart will converge on the current price, so we really only
      // want to show pricing around it within a reasonable threshold to prevent
      // the graph from being over-extended. We can calculate the bounds
      // on prices using their min/max respectively
      function getBounds (prices, threshold = 0.01) {
        let min = parseFloat(prices[0] || 0)
        let max = parseFloat(prices.slice(-1)[0] || 0)
        let lower = min
        let upper = min + threshold

        // bids and asks are sorted differently, reverse the min/max
        if (min >= max) lower = min - threshold

        return { lower, upper }
      }

      function trim (items) {
        let prices = Object.keys(items)
        let bounds = getBounds(prices)

        return prices.reduce(function (memo, item) {
          // if (items[item].length <= 1) return memo

          let value = parseFloat(item)

          // TODO: a bit arbitrary but it keeps a boundary
          // with the pricing so the chart isn't so spread out
          if (value < bounds.lower || value >= bounds.upper) return memo

          // copy it
          memo[item] = items[item]

          return memo
        }, {})
      }

      function sum (volumes) {
        return volumes.reduce(function (memo, item) {
          memo += parseFloat(item.volume)
          return memo
        }, 0)
      }

      function quantify (items) {
        return Object.keys(items).map(function (value) {
          let exchanges = items[value]

          return Object.keys(exchanges)
            .reduce(function (memo, exchange) {
              let values = exchanges[exchange]
              let total = sum(values)

              memo.exchanges[exchange] = total
              memo.volume += total

              return memo
            }, {
              volume: 0,
              value: value,
              exchanges: {}
            })
        })
      }

      // index the order volumes by price for all exchanges
      for (let ex in exchanges) {
        let data = exchanges[ex]
        merge(results.bids, group(ex, data.bids))
        merge(results.asks, group(ex, data.asks))
      }

      // calculate the current orders
      let bids = quantify(trim(results.bids))
      let asks = quantify(trim(results.asks))

      return { bids, asks }
    },

    getSeriesData: function (exchanges) {
      let data = this.getData(exchanges)

      function normalize (type, data) {
        return data
          .reduce(function (memo, item) {
            let volume = parseFloat(item.volume)
            let value = parseFloat(item.value)
            let total = memo.total + volume

            let result = {}
            result.exchanges = item.exchanges // copy this
            result[`${type}.volume.total`] = total
            result[`${type}.volume`] = volume
            result.value = value

            memo.total = total
            memo.items.push(Object.assign({}, result, {
              exchanges: item.exchanges
            }))

            return memo
          }, {
            total: 0,
            items: []
          })
      }

      // sanitize the data for the chart
      let bids = normalize('bids', data.bids).items.reverse()
      let asks = normalize('asks', data.asks).items

      return [].concat(bids, asks)
    },

    getLineData: function (exchanges) {
      let data = this.getData(exchanges)

      function normalize (type, data) {
        return data.reduce(function (memo, item) {
          memo[item.value] = {
            type: type,
            price: item.value,
            volume: item.volume
          }

          let xs = item.exchanges

          // copy exchanges over
          for (let ex in xs) {
            let val = xs[ex] * (/bids/ig.test(type) ? 1 : -1)

            memo[item.value][`exchange.${ex}`] = val
          }

          return memo
        }, {})
      }

      function merge (dest, data) {
        for (let price in data) {
          if (!dest[price]) dest[price] = []
          dest[price].push(data[price])
        }
        return dest
      }

      let bids = normalize('bids', data.bids)
      let asks = normalize('asks', data.asks)

      let results = {}
      results = merge(results, bids)
      results = merge(results, asks)

      return Object.keys(results).sort()
        .reduce((memo, price) => {
          let items = results[price]

          let value = { price }

          items.forEach((item) => {
            let keys = Object.keys(item)
            let type = item.type

            keys.forEach((key) => {
              if (/exchange/ig.test(key)) {
                value[`${type}.${key}`] = item[key]
              }
            })
          })

          memo.push(value)

          return memo
        }, [])
    },

    getNegBarData: function (exchanges) {
      return this.getLineData(exchanges).reverse()
    }
  },

  created: function () {
    let Series = Chart.createDepth({
      id: 'depth-chart',
      title: 'Price (BTC/ETH)'
    })

    let NegBar = Chart.createNegativeBar({
      id: 'neg-bar-chart',
      title: 'Price (BTC/ETH)'
    })

    this.$store.watch(this.getOrders, (data) => {
      Series.load(this.getSeriesData(data))
      NegBar.load(this.getNegBarData(data))
    })
  }

}
