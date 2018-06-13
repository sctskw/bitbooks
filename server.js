const path = require('path');
const restify = require('restify');
const API = require('./api');

//initialize the server
const server = restify.createServer({
  name: 'bitbooks'
});

//mount the web app base directory
server.get('/', restify.plugins.serveStatic({
  directory: path.resolve(__dirname, 'dist'),
  default: 'index.html'
}));

//mount the API
API.mount(server, '/api');

//start the server
server.listen(process.env.PORT || 11001, '0.0.0.0', function() {
  console.log(`${server.name} listening at ${server.url}`);
});
