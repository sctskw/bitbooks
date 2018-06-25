const promisify = require('util').promisify
const Clients = require(global.__appbase + '/lib/clients')

// return all enabled exchanges
function getAllExchanges (opts, callback) {
  try {
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

    return callback(null, result)
  } catch (err) {
    return callback(err)
  }
}

// export as promises so we can async/await
module.exports.getAllExchanges = promisify(getAllExchanges)
