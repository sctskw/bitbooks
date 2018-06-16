const bittrex = require('node.bittrex.api')
const log = require('../logging.js')('bittrex');

module.exports = {

  name: 'bittrex',

  allowed: /updateExchangeState/ig,

  format: function (message) {
    if (!this.allowed.test(message.M)) return false

    return {
      exchange: this.name,
      data: message.A
    }
  },

  connect: function (opts, callback) {
    bittrex.websockets.client(callback)
  },

  subscribe: function (opts, callback) {

    this.connect(opts, ()=> {

      log(`connected to ${this.name} exchange`)

      bittrex.websockets.subscribe(['BTC-ETH'], (data) => {

        let msg = this.format(data)

        if (msg) return callback(msg)
      })

    })
  },

  disconnect: function () {
    bittrex.websockets.disconnect()
  }
}
