var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , util    = require('util')
  , twitter = require('twitter')
  , env     = require('node-env-file')
  , t;

// Welcome message
server.listen(3000);
console.log("Node server started. Listening on port: 3000")

// Public folder
app.use('/', express.static(__dirname + '/public'));

// Routes
app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html');
  search = req.query || "";
});

// Twitter auth
env(__dirname + '/.env')
t = new twitter({
  consumer_key: process.env.consumerkey,
  consumer_secret: process.env.consumersecret,
  access_token_key: process.env.accesstokenkey,
  access_token_secret: process.env.accesstokensecret
});

// Twitter streaming
io.sockets.on('connection', function() {
  t.stream('filter', { 'locations': '-180,-90,180,90' }, function(stream) {
    stream.on('data', function(data){
      if (data.id != null) {
        io.sockets.emit('new message', data);
      }
    });
  });
});