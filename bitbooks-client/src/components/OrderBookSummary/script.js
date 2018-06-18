import { mapGetters } from 'vuex'

export default {

  name: 'OrderBookSummary',

  props: [],

  computed: mapGetters('OrderBook', {
    orders: 'getSummary',
    updated: 'getLastUpdated'
  }),

  methods: {
    renderError: function (err) {
      console.error(err)
    }
  },

  created: function () {
    this.$store.dispatch('OrderBook/getOrders')
  }

}
