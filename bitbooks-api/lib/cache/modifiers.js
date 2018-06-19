const Clients = require('../clients')
// const log = require('../logging.js')('storage')

function apply (storage) {
  // subscribe to all clients/exchanges
  Clients.subscribeAll({},

    // handle any subscription errors gracefully
    function onError (err) {
      console.error(err)
    },

    // broadcast all client messages to the server
    function onMessage (message) {
      // let msg = JSON.stringify(message)
      // log(`incoming update: ${msg}`)

      if (message.type === 'init') return storage.init(message)
      if (message.type === 'patch') return storage.patch(message)
    }
  )
}

module.exports = {
  apply
}
