const Router = require('restify-router').Router

const API = require('./api.js')
const Exchanges = new Router()

// return all the enabled Exchanges
// NOTE: async/await doesn't work without a wrapper fn
// which ends up being less terse so we avoid it for now
Exchanges.get('/', function (req, res, next) {
  API.getAllExchanges(
    {}, // TODO: ability to filter
    function (err, data) {
      if (err) return next(err)
      return res.send(data) && next()
    }
  )
})

module.exports = Exchanges
