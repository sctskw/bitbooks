const CONFIG = require('../config.js')
const log = require('../lib/logging.js')('server')

const SERVER = require('./main.js')
const SOCKET = require('./socket.js')
const STORAGE = require('../lib/cache')
const FEEDS = require('../bin/feeds.js')

function serve (port, server) {
  // start the server
  SERVER.listen(port, server, function () {
    log(`${SERVER.name} listening at ${SERVER.url}`)
  })

  return SERVER
}

async function startSocket (server) {
  try {
    let socket = await SOCKET.serve({
      // required: attach HTTP server
      server: server
    })

    if (!socket) throw new Error('socket was not created')

    log(`${server.name} socket is alive`)

    // broadcast subscription messages
    STORAGE.subscribe({}, function (message) {
      socket.broadcast(JSON.stringify(message))
    })
  } catch (err) {
    log(`socket server not started: ${err}`)
    process.exit(0)
  }
}

function startFeeds () {
  log('[feeder] starting feeds')

  // start the feeds
  FEEDS.start()
}

// only start the feeds if we're in Prod
if (process.env.NODE_ENV === 'production') startFeeds()

// start listening
startSocket(serve(CONFIG.API_PORT, CONFIG.API_SERVER))
