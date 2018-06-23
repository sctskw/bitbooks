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

    getChartData: function (exchanges) {
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

      // index the order volumes by price for all exchanges
      for (let ex in exchanges) {
        let data = exchanges[ex]
        merge(results.bids, group(ex, data.bids))
        merge(results.asks, group(ex, data.asks))
      }

      // calculate the current orders
      let bids = quantify(trim(results.bids))
      let asks = quantify(trim(results.asks))

      if (!bids.length || !asks.length) return []

      // sanitize the data for the chart
      bids = normalize('bids', bids).items.reverse()
      asks = normalize('asks', asks).items

      return [].concat(bids, asks)
    }

  },

  created: function () {
    let chart = Chart.createSeries({
      id: 'ob-chart',
      title: 'Price (BTC/ETH)'
    })

    this.$store.watch(this.getOrders, (data) => {
      chart.load(this.getChartData(data))
    })
  }

}
