/**
 * Simple WebSocket Server
 *
 * Docs: https://github.com/websockets/ws/blob/master/doc/ws.md
 */

const WebSocket = require('ws')
const promisify = require('util').promisify

function initSocketServer (config, callback) {
  try {
    // configs aren't required
    if (!config) config = {}

    if (!config.server) throw new Error('No HTTP Server Specified')

    const server = new WebSocket.Server({
      server: config.server
    })

    // mutate the server to have a broadcast method
    server.broadcast = function broadcast (data) {
      server.clients.forEach(function each (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
      })
    }

    // incoming connection established event
    server.on('connection', function (socket, req) {
      let address = req.connection.remoteAddress

      console.log(`incoming connection established: ${address}`)

      socket.send('connection established. welcome!')

      // save this for use later since we can't get access to it for some
      // reason
      socket.server = server

      // expose messages for each socket connection
      socket.on('message', (msg) => {
        server.emit('message', socket, msg)
      })

    })

    return callback(null, server)

  } catch (err) {
    console.error(err)
    if (typeof callback === 'function') return callback(err)
  }
}

module.exports.serve = function serveSocket (config) {
  return promisify(initSocketServer).call(this, config)
}
