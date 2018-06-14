/**
 * Simple WebSocket Server
 *
 * Docs: https://github.com/websockets/ws/blob/master/doc/ws.md
 */

const WebSocket = require('ws');

module.exports.serve = function initSocketServer(config, callback) {

  try {

    //configs aren't required
    if(!config) config = {};

    if(!config.server) throw "No HTTP Server Specified";

    const server = new WebSocket.Server({
      server: config.server
    }, function() {
      //NOOP: this isn't being called??
    });

    //connection established event
    server.on('connection', function(socket, req) {
      let address = req.connection.remoteAddress;
      console.log(`incoming connection established: ${address}`);
      socket.send('connection established. welcome!');
    });

    //incoming message event
    server.on('message', function(message) {
      console.log(`incoming message: ${message}`);
    });

    if(callback) return callback(null, server);

  } catch (err) {

    if(typeof callback === "function") return callback(err);

  }

}
