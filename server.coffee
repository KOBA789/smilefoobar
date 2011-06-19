http = require 'http'
fs = require 'fs'
url = require 'url'
staticResource = require './handler'
io = require 'socket.io'

handler = staticResource.createHandler fs.realpathSync('./public')

server = http.createServer (req, res) ->
  path = url.parse(req.url).pathname
  if !handler.handle path, req, res
    res.writeHead 404
    res.end '404'
server.listen 8124

socket = io.listen server
socket.on 'connection', (client) ->
  client.on 'message', (data) ->
    client.broadcast(data)
