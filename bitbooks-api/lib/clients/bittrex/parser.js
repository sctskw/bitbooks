module.exports.processOrderBook = function (data) {
  // format the order book into something more standarized downstream
  return {
    bids: data.buy.reduce(function (memo, order) {
      memo[order.Rate] = order.Quantity
      return memo
    }, {}),
    asks: data.sell.reduce(function (memo, order) {
      memo[order.Rate] = order.Quantity
      return memo
    }, {})
  }
}

module.exports.processUpdate = function (data) {
  // only check for status updates right now
  if (isModify(data)) return process(data)

  return false
}

function isModify (message) {
  return /updateExchangeState/ig.test(message.M)
}

function isValid (message) {
  return isModify(message)
}

function process (message) {
  let data = format(message)

  return data.map((data) => {
    return {
      type: 'patch',
      data: data.data || data,
      market: data.market.replace('-', '_')
    }
  })
}

function format (message) {
  let data = message.A || []

  if (!isValid(message)) return false

  return data.reduce(function (memo, order) {
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
}
