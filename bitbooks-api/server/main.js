const path = require('path')
const restify = require('restify')

const CONFIG = require('../config.js')
const API = require('./api.js')

// initialize the server
const server = restify.createServer({
  name: CONFIG.APP,
  strictRouting: false
})

// configure it
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

// mount the API
// NOTE: must do this first
API.mount(server, '/api')

// mount the web app base directory
server.get('*', restify.plugins.serveStatic({
  directory: path.resolve(CONFIG.APP_BASE, 'bitbooks-client/dist'),
  default: 'index.html'
}))

module.exports = server
