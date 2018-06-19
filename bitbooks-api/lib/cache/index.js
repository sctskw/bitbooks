const Redis = require('redis')

module.exports.subscribe = function (opts, callback) {
  const Storage = Redis.createClient(process.env.REDIS_URL)

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

  // TODO: subscribe to all things
  Storage.subscribe('poloniex::BTC_ETH')
  Storage.subscribe('bittrex::BTC_ETH')
}
