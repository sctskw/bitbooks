const logging = require(global.__appbase + '/lib/logging.js')
const log = logging('poloniex')
const Client = require('./api.js')

module.exports = {

  name: 'poloniex',

  enabled: true,

  api: new Client(),

  subscribe: function (opts, callback) {
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

  emit: function (message, callback) {
    let msg = this.format(message)

    if (msg) return callback(msg)
  },

  format: function (message) {
    return Object.assign({
      exchange: this.name
    }, message)
  }
}
