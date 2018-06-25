const EventEmitter = require('events').EventEmitter
const Redis = require('redis')

// NOTE: would prefer to use Redis for caching, but it's
// difficult to guarantee immediate consistency since you don't know
// when set() actually finishes. This causes data discrepancies
// so for now we just use an in-memory cache until a real DB is needed
const cache = require('memory-cache')

// Redis.debug_mode = true

/**
 * Simple storage class to house our Order Book data. It allows
 * for basic patching and emits events when updates are made.
 *
 * Structure:
 *
 *  <exchange>::<market> : { <price> : <volume> }
 *
 *  eg..
 *
 * 'poloniex::BTC_ETH' : { 0.0071212 : 1.2 }
 */
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

  // initialize the dataset by key in storage
  init (envelope) {
    let env = _unwrap(envelope)

    // update the values
    this.set(env.k, env.d)

    this.publish(env, this.get(env.k))
  }

  // patch the dataset by key in storage
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

// handles updating the current dataset for a storage key by patching in
// necessary updates/changes to the dataset that comes from the clients
// as individual updates
//
// @param type: string - bids, asks
// @param cache: object - the cache in its current state
// @param data: object - the new data to be patched/updated
function _patch (type, cache, data) {
  try {
    let amount = parseFloat(data.amount)
    let rate = data.rate.toString()
    let copy = JSON.parse(JSON.stringify(cache || {})) // clone

    // update the bids at this rate
    // positive value means it's the newest value in the order book
    // NOTE: we don't add these, we just replace since it's not an augment
    // but comes in as the adjusted value at a given price
    if (amount > 0) {
      copy[type][rate] = amount
      // console.log(`patched [${type}] ${rate} => ${amount}`)
    }

    // clear the bids at this rate since the volume is 0 or less
    // NOTE: super aggressive clearing just in case
    if (amount <= 0) {
      copy[type][rate] = 0
      copy[type][rate] = null
      delete copy[type][rate]
      // console.log(`patched [${type}] ${rate} => ${amount}`)
    }

    return copy
  } catch (err) {
    console.log(err)
  }
}

// parse an envelope into something more useful to use later
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
