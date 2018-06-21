const path = require('path')
const restify = require('restify')
const API = require('main.js')
const SOCKET = require('./socket.js')
const STORAGE = require('./lib/cache')
const FEEDS = require('./bin/feeds.js')
const log = require('./lib/logging.js')('server')

// TODO: move to CONFIG
const APP = 'bitbooks'
const APP_BASE = process.env.APP_BASE || __dirname
const API_SERVER = '0.0.0.0' // localhost
const API_PORT = process.env.PORT || 11001

// initialize the server
const server = restify.createServer({
  name: APP,
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
  directory: path.resolve(APP_BASE, 'bitbooks-client/dist'),
  default: 'index.html'
}))

if (process.env.NODE_ENV !== 'test') {
  // start the server
  server.listen(API_PORT, API_SERVER, function () {
    log(`${server.name} listening at ${server.url}`)
  })
}

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
