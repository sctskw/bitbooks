const server = require('./server.js')
const CONFIG = require('../config.js')
const log = require('../lib/logging.js')('server')

// start the server
server.listen(CONFIG.API_PORT, CONFIG.API_SERVER, function () {
  log(`${server.name} listening at ${server.url}`)
})
