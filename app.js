var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , util    = require('util')
  , twitter = require('twitter')
  , env     = require('node-env-file')
  , tweetData
  , t;

// Welcome message
server.listen(process.env.PORT || 5000);
console.log("Node server started.");

// Public folder
app.use('/', express.static(__dirname + '/public'));

// Routes
app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html');
  search = req.query || "";
});

// Twitter auth
// env(__dirname + '/.env');
t = new twitter({
  consumer_key: process.env.consumerkey,
  consumer_secret: process.env.consumersecret,
  access_token_key: process.env.accesstokenkey,
  access_token_secret: process.env.accesstokensecret
});

// Twitter streaming
t.stream('filter', { 'locations': '-180,-90,180,90' }, function(stream) {
  stream.on('data', function(data){
    if (data.id != null) {
      if (tweetData == null) {
        tweetData = data;
      } else {
        io.sockets.emit('new message', tweetData);
        tweetData = null;
      }
    }
  });
});
