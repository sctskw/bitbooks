import { mapGetters } from 'vuex'

export default {

  name: 'OrderBookSummary',

  computed: {
    ...mapGetters({
      connected: 'isConnected'
    }),
    ...mapGetters('OrderBook', {
      summary: 'getSummary',
      updated: 'getLastUpdated',
      orders: 'getOrders'
    })
  },

  methods: {
    ...mapGetters(['isConnected'])
  },

  created: function () {
    this.$store.watch(this.isConnected, (connected) => {
      this.$store.dispatch('OrderBook/setSummary')
    })
  }

}
