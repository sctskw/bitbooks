const EventEmitter = require('events').EventEmitter
const Cache = require('node-cache')

class Storage extends EventEmitter {
  constructor () {
    super()
    this._cache = new Cache()
  }

  init (envelope) {
    let env = _unwrap(envelope)

    this._cache.set(env.k, env.d)

    this.emit('change', env.e, env.m, this._cache.get(env.k))
  }

  patch (envelope) {
    let env = _unwrap(envelope)
    let data = env.d
    let type = data.type
    let curr = this._cache.get(env.k)

    if (/bid/ig.test(type)) _patch('bids', curr, data)
    if (/ask/ig.test(type)) _patch('asks', curr, data)

    // update the cache
    this._cache.set(env.k, curr)

    this.emit('change', env.e, env.m, this._cache.get(env.k))
  }
}

function _patch (type, cache, data) {
  let amount = Math.floor(data.amount)

  // update the bids at this rate
  if (amount > 0) cache[type][data.rate] = data.amount

  // clear the bids at this rate since the volume is 0 or less
  if (amount <= 0) delete cache['bids'][data.rate]
}

function _unwrap (envelope) {
  let exchange = envelope.exchange
  let data = envelope.data
  let market = envelope.market
  let key = `${exchange}::${market}`

  return {
    e: exchange,
    m: market,
    k: key,
    d: data
  }
}

module.exports = Storage
