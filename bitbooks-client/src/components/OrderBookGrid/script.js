import { mapGetters } from 'vuex'

export default {

  name: 'OrderBookGrid',

  data: function () {
    return {
      text: 'Asks',
      headers: [
        {
          text: 'Exchange',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Type', value: 'type' },
        { text: 'Quanity/Volume', value: 'volume' },
        { text: 'Price (ETH)', value: 'price' }
      ],

      bids: [{
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'bid',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }],

      asks: [{
        name: 'poloniex',
        type: 'ask',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'ask',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'ask',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'bittrex',
        type: 'ask',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }, {
        name: 'poloniex',
        type: 'ask',
        volume: 21.11122,
        price: 1.3,
        prices: {
          eth: 1.3,
          btc: 0.0005
        }
      }]
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

    getBooks: function (data) {

    }

  },

  created: function () {
    this.$store.watch(this.getOrders, (data) => {
      console.log(this.getBooks(data))
    })
  }

}
