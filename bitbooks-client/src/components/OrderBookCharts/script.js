import { mapGetters } from 'vuex'

export default {

  name: 'OrderBookCharts',

  props: ['data'],

  computed: {
    ...mapGetters({
      connected: 'isConnected'
    })
  },

  methods: {

    ...mapGetters(['isConnected']),

    ...mapGetters('OrderBook', ['getOrders']),

    renderChart: function (opts, data) {}

  },

  created: function () {}

}
