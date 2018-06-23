const EventEmitter = require('events').EventEmitter
const Redis = require('redis')

// NOTE: would prefer to use Redis for caching, but it's difficult to guarantee immediate
// consistency since you don't know when set() actually finishes. This causes data discrepancies
// so for now we just use an in-memory cache until a real DB is needed
const cache = require('memory-cache')

// Redis.debug_mode = true

class Storage extends EventEmitter {
  constructor () {
    super()

    this._pub = Redis.createClient(process.env.REDIS_URL)
    this._cache = new cache.Cache()
  }

  set (key, data) {
    return this._cache.put(key, JSON.stringify(data))
  }

  get (key) {
    try {
      return JSON.parse(this._cache.get(key))
    } catch (err) {
      return null
    }
  }

  init (envelope) {
    let env = _unwrap(envelope)

    // update the values
    this.set(env.k, env.d)

    this.publish(env, this.get(env.k))
  }

  patch (envelope, callback = function () {}) {
    try {
      let env = _unwrap(envelope)
      let data = env.d
      let type = data.type
      let op = /bid/ig.test(type) ? 'bids' : 'asks'

      // get current dataset
      let curr = this.get(env.k)

      // create new dataset
      let replace = _patch(op, curr, data)

      // update the cache
      this.set(env.k, replace)

      // broadcast the new data
      this.publish(env, this.get(env.k))
    } catch (err) {
      console.error(err)
    }
  }

  publish (env, data) {
    this._pub.publish(env.k, JSON.stringify(data))
    this.emit('change', env.e, env.m, data)
  }
}

function _patch (type, cache, data) {
  try {
    let amount = parseFloat(data.amount)
    let rate = data.rate.toString()
    let copy = JSON.parse(JSON.stringify(cache || {})) // clone

    // update the bids at this rate
    if (amount > 0) {
      copy[type][rate] = amount
      console.log(`patched [${type}] ${rate} => ${amount}`)
    }

    // clear the bids at this rate since the volume is 0 or less
    if (amount <= 0) {
      copy[type][rate] = 0
      copy[type][rate] = null
      delete copy[type][rate]
      console.log(`patched [${type}] ${rate} => ${amount}`)
    }

    return copy
  } catch (err) {
    console.log(err)
  }
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
