const path = require('path');
const restify = require('restify');
const API = require('./main.js');
const SOCKET = require('./socket.js');

//TOOD: move to CONFIG
const APP = 'bitbooks';
const APP_BASE = process.env.APP_BASE || __dirname;
const API_SERVER = '0.0.0.0';
const API_PORT = process.env.API_PORT || 11001;
const SOCKET_SERVER = API_SERVER;
const SOCKET_PORT = process.env.SOCKET_PORT || 11002;

//initialize the server
const server = restify.createServer({
  name: APP,
  strictRouting: false
});

//configure it
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//mount the API
//NOTE: must do this first
API.mount(server, '/api');

//mount the web app base directory
server.get('*', restify.plugins.serveStatic({
  //TODO: how to deal with relative pathing? aliases? globals?
  directory: path.resolve(APP_BASE, 'bitbooks-client/dist'),
  default: 'index.html'
}));

//start the server
server.listen(API_PORT, API_SERVER, function() {
  console.log(`${server.name} listening at ${server.url}`);
});

//start the socket server
SOCKET.serve({
  server: SOCKET_SERVER,
  port: SOCKET_PORT,

  //TODO: connect these
  handlers: {
    connection: function(socket, req) {

    },
    message: function(message) {

    }
  }
});
