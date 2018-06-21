const path = require('path')
const restify = require('restify')

const CONFIG = require('../config.js')
const API = require('./main.js')
const SOCKET = require('./socket.js')
const STORAGE = require('../lib/cache')
const FEEDS = require('../bin/feeds.js')
const log = require('../lib/logging.js')('server')

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
  // TODO: how to deal with relative pathing? aliases? globals?
  directory: path.resolve(CONFIG.APP_BASE, 'bitbooks-client/dist'),
  default: 'index.html'
}))

// start the socket server
SOCKET.serve({

  // required: attach HTTP server
  server: server

}, function (err, ws) {
  if (err) {
    log(`error: ${err}`)
    process.exit(0)
  }

  log(`${server.name} socket is alive`)

  // broadcast subscription messages
  STORAGE.subscribe({}, function (message) {
    ws.broadcast(JSON.stringify(message))
  })
})

if (process.env.NODE_ENV === 'production') {
  console.log('[feeder] starting feeds')

  // start the feeds
  FEEDS.start()
}

module.exports = server
