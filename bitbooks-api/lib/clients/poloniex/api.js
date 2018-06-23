const EventEmitter = require('events')
const promisify = require('util').promisify
const Poloniex = require('poloniex-api-node')
const Parser = require('./parser.js')

const logging = require(global.__appbase + '/lib/logging.js')
const log = logging('poloniex')

class PoloniexApi extends EventEmitter {
  constructor () {
    super()
    this._api = new Poloniex()
  }

  destroy () {
    this.disconnect()
    this._api = null
  }

  connect (opts, callback) {
    this._api.on('open', ($event) => {
      if (!/open/ig.test($event.type)) {
        return callback(new Error('could not connect'))
      }

      log(`connected to exchange`)

      return callback(null, true)
    })

    this._api.openWebSocket({version: 2})
  }

  disconnect () {
    if (this._api) this._api.closeWebSocket()
    this._api = null
  }

  async subscribe (opts) {
    // TODO: multiple markets
    opts.markets = ['BTC_ETH']

    if (!opts.markets) throw new Error('no markets provided')

    // create the connection
    await promisify(this.connect).call(this, opts)

    // subscribe to all markets
    this.subscribeTo(opts.markets)

    this._api.on('message', this.onMessage.bind(this))
  }

  subscribeTo (markets) {
    markets.forEach((market) => {
      log(`subscribing to market [${market}]`)
      this._api.subscribe(market)
    })
  }

  onMessage (channel, data, seq) {
    let messages = Parser.process({channel, data, seq})

    if (!messages) return false

    messages.forEach((msg) => {
      this.emit(msg.event, msg.data)
    })
  }
}

module.exports = PoloniexApi
