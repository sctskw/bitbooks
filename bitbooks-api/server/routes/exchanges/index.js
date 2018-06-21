const Router = require('restify-router').Router

const Exchanges = new Router()

Exchanges.get('/', function (req, res, next) {
  res.send({alive: true})
  return next()
})

module.exports = Exchanges
