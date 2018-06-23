const log = require(global.__appbase + '/lib/logging.js')('bittrex')

const Client = require('./api.js')

module.exports = {

  name: 'bittrex',

  enabled: true,

  // expose the API
  api: new Client(),

  subscribe: function (opts, callback) {
    // TODO: handle market conversion
    opts.markets = ['BTC-ETH']

    this.api.on('ORDER_BOOK::STATUS', (data) => {
      log('[current order book]', data)
      this.emit(data, callback)
    })

    this.api.on('ORDER_BOOK::UPDATE', (data) => {
      log('[order book update]', data)
      this.emit(data, callback)
    })

    this.api.subscribe(opts)
  },

  // emit message or groups of messages
  emit: function (message, callback) {
    if (message instanceof Array && message.length) {
      message.forEach((msg) => {
        this.emit(msg, callback)
      })

      return true
    }

    let msg = Object.assign({exchange: this.name}, message)

    return callback(msg)
  }
}
