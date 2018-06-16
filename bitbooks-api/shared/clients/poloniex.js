const Poloniex = require('poloniex-api-node')
const log = require('../logging.js')('poloniex')

module.exports = {

  name: 'poloniex',

  allowed: false,

  format: function (message) {
    return {
      exchange: this.name,
      type: message.channel,
      data: message.data
    }
  },

  emit: function(message, callback) {
    let msg = this.format(message);
    if(msg) return callback(msg)
  },

  connect: function (opts, callback) {

    this.api = new Poloniex()

    this.api.on('open', callback)

    this.api.openWebSocket({version: 2})

  },

  subscribe: function (opts, callback) {
    this.connect(opts, () => {
      log(`connected to ${this.name} exchange`)

      // TODO: log the subscriptions
      this.api.subscribe('BTC_ETH')

      this.api.on('message', (channel, data, seq) => {
        let message = {channel, data, seq}
        this.emit(message, callback)
      })

    })
  },

  disconnect: function () {
    this.api.closeWebSocket()
    this.api = null
  }
}
