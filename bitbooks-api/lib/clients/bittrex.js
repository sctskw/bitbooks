const bittrex = require('node.bittrex.api')
const log = require('../logging.js')('bittrex')

module.exports = {

  name: 'bittrex',

  enabled: true,

  // regex to check for message topics we actually care about
  allowed: /updateExchangeState/ig,

  // expose the API
  api: bittrex,

  // normalize the message format
  format: function (message) {
    if (!this.allowed.test(message.M)) return false

    return message.A.map((data) => {
      return {
        exchange: this.name,
        market: data.MarketName.replace('-', '_'), // normalize BTC-ETH to BTC_ETH
        data: data
      }
    })
  },

  // emit messages
  // NOTE: bittrex groups these together in a array, but we want individual
  // updates/messages per emission
  emit: function (message, callback) {
    let msg = this.format(message)
    if (msg && msg.length) msg.forEach(callback)
  },

  connect: function (opts, callback) {
    bittrex.websockets.client(callback)
  },

  subscribe: function (opts, callback) {
    this.connect(opts, () => {
      log(`connected to ${this.name} exchange`)

      // TODO: pull subscriptions from opts/config
      bittrex.websockets.subscribe(['BTC-ETH'], (data) => {
        this.emit(data, callback)
      })
    })
  },

  disconnect: function () {
    bittrex.websockets.disconnect()
  }
}
