const bittrex = require('node.bittrex.api')
const log = require('../logging.js')('bittrex')

module.exports = {

  name: 'bittrex',

  enabled: true,

  // regex to check for message topics we actually care about
  allowed: /updateExchangeState/ig,

  // expose the API
  api: bittrex,

  isInit: function (message) {
    return /init$/i.test(message.type)
  },

  isModify: function (message) {
    return /updateExchangeState/ig.test(message.type || message.M)
  },

  getType: function (message) {
    if (this.isInit(message)) return 'init'
    if (this.isModify(message)) return 'patch'
    return null
  },

  subscribe: function (opts, callback) {
    const markets = ['BTC-ETH']

    // NOTE: the WS API does not give the initial state of the OrderBooks
    // so we use the REST Api to grab the current state first, then use the
    // socket for modifications
    this.getOrderBook({
      market: markets[0]
    }, (err, data) => {
      if (err) return callback(err)

      log(`retrieved ${this.name} current order book`)

      // propagate as a message
      this.emit({
        type: 'init',
        data: data
      }, callback)

      // connect to the WS API
      this.connect(opts, () => {
        log(`connected to ${this.name} exchange`)

        // TODO: pull subscriptions from opts/config
        bittrex.websockets.subscribe(markets, (data) => {
          this.emit(data, callback)
        })
      })
    })
  },

  connect: function (opts, callback) {
    bittrex.websockets.client(callback)
  },

  disconnect: function () {
    bittrex.websockets.disconnect()
  },

  // emit messages
  // NOTE: bittrex groups these together in a array, but we want individual
  // updates/messages per emission
  emit: function (message, callback) {
    let msgs = this.process(message)
    if (msgs && msgs.length) msgs.forEach(callback)
  },

  format: function (message) {
    let type = message.M
    let data = message.A || []

    if (!type) return false

    let output = {
      type: this.getType(message)
    }

    output.data = data.reduce(function (memo, order) {
      let market = order.MarketName

      let asks = order.Sells.map(function (sell) {
        return {
          market: market,
          data: {
            type: 'ask',
            rate: sell.Rate,
            amount: sell.Quantity
          }
        }
      })

      let bids = order.Buys.map(function (buy) {
        return {
          market: market,
          data: {
            type: 'bid',
            rate: buy.Rate,
            amount: buy.Quantity
          }
        }
      })

      memo = memo.concat(asks, bids)

      return memo
    }, [])

    return output
  },

  process: function (message) {
    if (!message.type) message = this.format(message)

    const msg = {
      exchange: this.name,
      type: message.type
    }

    if (!msg.type) return false

    return message.data.reduce((memo, data) => {
      memo.push(Object.assign({}, msg, {
        data: data.data || data,
        market: data.market.replace('-', '_')
      }))
      return memo
    }, [])
  },

  getOrderBook: function (opts, callback) {
    if (!opts.market) return callback(new Error('no market provided'))

    this.api.getorderbook({
      market: opts.market,
      type: 'both'
    // NOTE: this API is backwards
    }, (resp, err) => {
      if (err) return callback(new Error(err.message))

      // format the order book into something more standarized downstream
      let data = {
        bids: resp.result.buy.reduce(function (memo, order) {
          memo[order.Rate] = order.Quantity
          return memo
        }, {}),
        asks: resp.result.buy.reduce(function (memo, order) {
          memo[order.Rate] = order.Quantity
          return memo
        }, {})
      }

      return callback(null, [{
        market: opts.market,
        data: data
      }])
    })
  }
}
