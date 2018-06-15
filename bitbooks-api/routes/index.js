const Router = require('restify-router').Router
const Exchanges = require('./exchanges')

const Routes = new Router()

Routes.add('/exchanges', Exchanges)

module.exports = Routes
