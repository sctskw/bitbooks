const Poloniex = require('poloniex-api-node')
const log = require('../logging.js')('poloniex')

module.exports = {

  name: 'poloniex',

  allowed: /orderBook|orderBookModify/ig,

  isInit: function (message) {
    return /orderBook$/i.test(message.type)
  },

  isModify: function (message) {
    return /orderBookModify|orderBookRemove/ig.test(message.type)
  },

  process: function (message) {
    return message.data.reduce((memo, message) => {
      if (this.isInit(message)) {
        memo.push(this.format(message, 'init'))
      }

      if (this.isModify(message)) {
        memo.push(this.format(message, 'patch'))
      }

      return memo
    }, [])
  },

  format: function (message, type) {
    return {
      exchange: this.name,
      market: message.channel,
      type: type,
      data: message.data
    }
  },

  emit: function (message, callback) {
    let msgs = this.process(message)

    if (!msgs || !msgs.length) return false

    msgs.forEach(callback)
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
