const path = require('path');
const restify = require('restify');
const API = require('./api');

const APP = 'bitbooks';

//initialize the server
const server = restify.createServer({
  name: APP,
  strictRouting: false
});

//mount the API
//NOTE: must do this first
API.mount(server, '/api');

//mount the web app base directory
server.get('*', restify.plugins.serveStatic({
  directory: path.resolve(__dirname, './bitbooks-client/dist'),
  default: 'index.html'
}));

//start the server
server.listen(process.env.PORT || 11001, '0.0.0.0', function() {
  console.log(`${server.name} listening at ${server.url}`);
});
