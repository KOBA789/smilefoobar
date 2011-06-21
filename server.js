(function() {
  var fs, handler, http, io, server, socket, staticResource, url;
  http = require('http');
  fs = require('fs');
  url = require('url');
  staticResource = require('./handler');
  io = require('socket.io');
  handler = staticResource.createHandler(fs.realpathSync('./public'));
  server = http.createServer(function(req, res) {
    var path;
    path = url.parse(req.url).pathname;
    if (path === '/') {
      path = '/index.html';
    }
    if (!handler.handle(path, req, res)) {
      res.writeHead(404);
      return res.end('404');
    }
  });
  server.listen(5089);
  socket = io.listen(server);
  socket.on('connection', function(client) {
    return client.on('message', function(data) {
      return client.broadcast(data);
    });
  });
}).call(this);
