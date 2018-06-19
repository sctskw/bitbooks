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

  getType: function (message) {
    if (this.isInit(message)) return 'init'
    if (this.isModify(message)) return 'patch'
    return null
  },

  process: function (message) {
    // default message envelope
    const msg = {
      exchange: this.name,
      market: message.channel
    }

    return message.data.reduce((memo, data) => {
      // identify the message type
      let type = this.getType(data)

      // no defined type, ignore message
      if (!type) return memo

      // append the message with proper formatting
      memo.push(Object.assign({}, msg, { data: data.data, type }))

      return memo
    }, [])
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
