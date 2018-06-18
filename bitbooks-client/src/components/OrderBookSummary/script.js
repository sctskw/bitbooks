import { mapGetters } from 'vuex'

export default {

  name: 'OrderBookSummary',

  computed: {
    ...mapGetters({
      connected: 'isConnected'
    }),
    ...mapGetters('OrderBook', {
      orders: 'getSummary',
      updated: 'getLastUpdated'
    })
  },

  methods: {

    ...mapGetters(['isConnected']),

    renderError: function (err) {
      console.error(err)
    }
  },

  created: function () {
    this.$store.dispatch('OrderBook/getOrders')
  }

}
