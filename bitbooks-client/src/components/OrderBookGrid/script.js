import { mapGetters } from 'vuex'

export default {

  name: 'OrderBookGrid',

  data: function () {
    return {
      bids: [],
      asks: [],
      headers: [
        {
          text: 'Exchange',
          align: 'center',
          sortable: false,
          value: 'exchange'
        },
        {
          text: 'Price',
          value: 'price',
          sortable: false,
          align: 'right'
        },
        {
          text: 'Quantity',
          value: 'volume',
          sortable: false,
          align: 'right'
        }
      ]
    }
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

    getBooks: function (exchanges) {
      function process (data) {
        return data.items.map((item) => {
          return {
            type: data.type,
            exchange: data.exchange.split('::')[0],
            volume: item.volume,
            price: item.value
          }
        })
      }

      function sortBy (a, b, key) {
        return a[key] - b[key]
      }

      // function sortByVolume (a, b) {
      //   return sortBy(a, b, 'volume')
      // }

      function sortByPrice (a, b) {
        return sortBy(a, b, 'price')
      }

      let results = {
        asks: [],
        bids: []
      }

      for (let ex in exchanges) {
        let asks = process({
          type: 'ask',
          exchange: ex,
          items: exchanges[ex].asks
        }).sort(sortByPrice)

        let bids = process({
          type: 'bid',
          exchange: ex,
          items: exchanges[ex].bids
        }).sort(sortByPrice)

        results.asks = results.asks.concat(asks)
        results.bids = results.bids.concat(bids)
      }

      return results
    }
  },

  created: function () {
    this.$store.watch(this.getOrders, (data) => {
      let orders = this.getBooks(data)
      this.$data.bids = orders.bids.reverse()
      this.$data.asks = orders.asks.reverse()
    })
  }

}
