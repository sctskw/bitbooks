const Router = require('restify-router').Router

const Clients = require(global.__appbase + '/lib/clients')

const Exchanges = new Router()

// return all the enabled Exchanges
Exchanges.get('/', function (req, res, next) {
  let exchanges = Object.keys(Clients.EXCHANGES)

  let result = exchanges.reduce((memo, ex) => {
    let exchange = Clients.EXCHANGES[ex]

    if (!exchange || !exchange.enabled) return memo

    memo.push({
      enabled: exchange.enabled,
      name: exchange.name
    })

    return memo
  }, [])

  res.send(result)

  return next()
})

module.exports = Exchanges
