export default {

  name: 'OrderBookSummary',

  props: [],

  data: function () {
    return {
      totals: {
        bids: 0,
        asks: 0
      }
    }
  },

  methods: {

    renderError: function (err) {
      console.error(err)
    },

    getSummary: function (callback) {
      return callback(null, {
        totals: {
          asks: Math.floor(Math.random() * 100),
          bids: Math.floor(Math.random() * 100)
        }
      })
    }

  },

  created: function () {
    this.getSummary((err, data) => {
      if (err) return this.renderError(err)

      // update props
      this.totals.bids = data.totals.bids
      this.totals.asks = data.totals.asks
    })
  }

}
