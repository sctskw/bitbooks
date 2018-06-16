const EXCHANGES = {
  bittrex: require('./bittrex.js'),
  poloniex: require('./poloniex.js')
}

function subscribe (opts, onError, onMessage) {
  try {
    for (let ex in EXCHANGES) {
      try {
        let exchange = EXCHANGES[ex]
        exchange.subscribe(opts, onMessage)
      } catch (err) {
        throw new Error(`could not subscribe to exchange: ${ex} :: ${err}`)
      }
    }
  } catch (err) {
    onError(err)
  }
}

module.exports = {
  subscribe
}
