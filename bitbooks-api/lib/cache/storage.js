const Promisify = require('util').promisify
const EventEmitter = require('events').EventEmitter
const Redis = require('redis')

// Redis.debug_mode = true

class Storage extends EventEmitter {
  constructor () {
    super()

    this._cache = Redis.createClient(process.env.REDIS_URL)

    // attach as promise
    this._get = Promisify(this._cache.get).bind(this._cache)
    this._set = Promisify(this._cache.set).bind(this._cache)
  }

  async set (key, data) {
    await this._cache.set(key, JSON.stringify(data))
  }

  async get (key) {
    let value = await this._get(key)
    return JSON.parse(value || {})
  }

  async init (envelope) {
    let env = _unwrap(envelope)

    // update the values
    this.set(env.k, env.d)

    let value = await this.get(env.k)

    this.publish(env, value)
  }

  async patch (envelope) {
    let env = _unwrap(envelope)
    let data = env.d
    let type = data.type
    let curr = await this.get(env.k) || {}

    if (/bid/ig.test(type)) _patch('bids', curr, data)
    if (/ask/ig.test(type)) _patch('asks', curr, data)

    // update the cache
    await this.set(env.k, curr)

    let value = await this.get(env.k)

    this.publish(env, value)
  }

  publish (env, data) {
    this._cache.publish(env.k, JSON.stringify(data))
    this.emit('change', env.e, env.m, data)
  }
}

function _patch (type, cache, data) {

  let amount = parseFloat(data.amount)
  let rate = data.rate.toString()

  // update the bids at this rate
  if (amount > 0) {
    cache[type][rate] = amount
    return true
  }

  // clear the bids at this rate since the volume is 0 or less
  if (amount <= 0) {
    cache[type][rate] = 0
    cache[type][rate] = null
    delete cache[type][rate]
    return true
  }

  return false
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
