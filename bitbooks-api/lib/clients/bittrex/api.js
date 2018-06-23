const EventEmitter = require('events')
const promisify = require('util').promisify
const Bittrex = require('node.bittrex.api')
const Parser = require('./parser.js')

class BittrexApi extends EventEmitter {
  constructor () {
    super()
    this._api = Bittrex
  }

  destroy () {
    this.disconnect()
    this._api = null
    this._conn = null
  }

  disconnect () {
    Bittrex.websockets.disconnect()
  }

  async subscribe (opts) {
    if (!opts.markets) throw new Error('no markets provided')

    // get the order book first since it's not provided by the WebSocket Client
    // on initial connection
    let orderBook = await promisify(this.getOrderBook).call(this, opts)

    // push the order book notification
    this.emit('ORDER_BOOK::STATUS', orderBook)

    // connect to client
    Bittrex.websockets.client((client) => {
      // save it for later. could be useful
      this._conn = client

      // subscribe to WS events/messages per market
      Bittrex.websockets.subscribe(opts.markets, (data) => {
        let msg = Parser.processUpdate(data)

        // only process known messages
        if (msg) this.emit('ORDER_BOOK::UPDATE', msg)
      })
    })
  }

  getOrderBook (opts, callback) {
    // markets are required for passage
    if (!opts.market) return callback(new Error('no market provided'))

    this._api.getorderbook({

      // TODO: multiple markets
      market: opts.markets[0],

      // request both buys and sells
      type: 'both'

    // NOTE: this API is backwards from the Standard. Australian maybe?
    // This prevent the use of Promises and thusly async/await
    }, (resp, err) => {
      if (err) return callback(new Error(err.message))

      // parse the response
      let data = Parser.processOrderBook(resp.result)

      return callback(null, {
        type: 'init',
        market: opts.market.replace('-', '_'),
        data: data
      })
    })
  }
}

module.exports = BittrexApi
