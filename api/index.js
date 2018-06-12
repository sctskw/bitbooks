const Router = require('restify-router').Router;

module.exports.mount = function(path, server) {

  //force to always be JSON
  server.pre(function(req, res, next) {
    req.headers.accept = 'application/json';
    return next();
  });

  const API = new Router();
  const TEST = new Router();
  const STUFF = new Router();


  TEST.get('/', function(req, res, next) {
    res.send({test: true});
    return next();
  })

  STUFF.get('/', function(req, res, next) {
    res.send({stuff: true});
    return next();
  })

  API.add('/test', TEST);
  API.add('/stuff', STUFF);

  API.applyRoutes(server, '/api');

  return server;

}
