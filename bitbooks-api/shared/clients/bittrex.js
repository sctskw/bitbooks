const bittrex = require('node.bittrex.api')

// TODO: move to shared
function getLog (namespace) {
  return function logger (msg, data) {
    console.log(`[${namespace}] ${msg}`, JSON.stringify(data))
  }
}

const log = getLog('bittrex')

module.exports = {

  name: 'bittrex',

  allowed: /updateExchangeState/ig,

  connect: function (opts, callback) {
    bittrex.websockets.client(this.subscribe.bind(this, opts, callback))
  },

  format: function (message) {
    if (!this.allowed.test(message.M)) return false

    return {
      exchange: this.name,
      data: message.A
    }
  },

  subscribe: function (opts, callback) {
    bittrex.websockets.subscribe(['BTC-ETH'], (data) => {
      log('incoming update', data)

      let msg = this.format(data)

      if (msg) return callback(msg)
    })
  },

  disconnect: function () {
    bittrex.websockets.disconnect()
  }
}
