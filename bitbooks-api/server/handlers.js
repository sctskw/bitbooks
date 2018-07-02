const log = require('../lib/logging.js')('socket.handlers')

const STORAGE = require('../lib/cache')

const HANDLERS = {

  subscribe: function (socket, message) {
    let data = message && message.data
    let subs = data.markets

    log(`subscribing to: ${JSON.stringify(subs)}`)

    STORAGE.subscribe({
      subscriptions: subs
    }, function (message) {
      socket.server.broadcast(JSON.stringify(message))
    })
  }

}

// parser
// deserialize and execute the message handler
module.exports.parse = function (socket, message) {
  try {
    let data = decode(message)

    if(!data.type) return false
    if(!HANDLERS[data.type]) return false

    // execute it
    HANDLERS[data.type].call(this, socket, data)

  } catch (err) {
    log(`could not parse message: ${err}`)
  }
}

// decode socket messages
function decode (message) {
  try {
    return JSON.parse(message)
  } catch (err) {
    return message
  }
}
