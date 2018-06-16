const bittrex = require('node.bittrex.api')
const log = require('../logging.js')('bittrex');

module.exports = {

  name: 'bittrex',

  allowed: /updateExchangeState/ig,

  format: function (message) {

    if (!this.allowed.test(message.M)) return false

    return message.A.map((data) => {
      return {
        exchange: this.name,
        market: data.MarketName.replace('-', '_'), //normalize BTC-ETH to BTC_ETH
        data: data
      }
    })

  },

  emit: function (message, callback) {
    let msg = this.format(message)
    if(msg && msg.length) msg.forEach(callback)
  },

  connect: function (opts, callback) {
    bittrex.websockets.client(callback)
  },

  subscribe: function (opts, callback) {

    this.connect(opts, ()=> {

      log(`connected to ${this.name} exchange`)

      bittrex.websockets.subscribe(['BTC-ETH', 'BTC-DCR'], (data) => {
        this.emit(data, callback)
      })

    })
  },

  disconnect: function () {
    bittrex.websockets.disconnect()
  }
}
