const API = require('./routes');

module.exports.mount = function(server, path) {

  //force to always be JSON
  server.pre(function(req, res, next) {
    req.headers.accept = 'application/json';
    return next();
  });

  //mount the API routes
  API.applyRoutes(server, path || '/api');

  return server;

}
