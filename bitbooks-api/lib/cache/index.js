const Redis = require('redis')

/**
 * Subscribe to the published events coming from Redis
 */
module.exports.subscribe = function (opts, callback) {
  const Storage = Redis.createClient(process.env.REDIS_URL)
  const subscriptions = (opts && opts.subscriptions) || []


  Storage.on('message', function (channel, message) {
    let [exchange, market] = channel.split('::')

    let msg = {
      key: channel,
      exchange: exchange,
      market: market,
      data: JSON.parse(message)
    }

    return callback(msg)
  })

  // suscribe to published events
  subscriptions.forEach((sub) => {
    Storage.subscribe(sub)
  })

}
