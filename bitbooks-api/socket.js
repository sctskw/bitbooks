/**
 * Simple WebSocket Server
 *
 * Docs: https://github.com/websockets/ws/blob/master/doc/ws.md
 */

const WebSocket = require('ws');

const DEFAULT_SERVER = '0.0.0.0';
const DEFAULT_PORT = 11002;

module.exports.serve = function initSocketServer(config) {

  //configs aren't required
  if(!config) config = {};

  //setup defaults
  if(!config.server) config.server = process.env.SOCKET_SERVER || DEFAULT_SERVER;
  if(!config.port) config.port = process.env.SOCKET_PORT || DEFAULT_PORT;

  //create the server
  const server = new WebSocket.Server({
    server: config.server,
    port: config.port
  }, function() {
    console.log(`bitbooks socket listening on ws://${config.server}:${config.port}`);
  });

  //connection established event
  server.on('connection', function(socket, req) {
    console.log(`incoming connection established: ${req.connection.remoteAddress}`);
    socket.send('connection established. welcome!');
  });

  //incoming message event
  server.on('message', function(message) {
    console.log(`incoming message: ${message}`);
  });

}
