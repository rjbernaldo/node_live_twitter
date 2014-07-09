var express = require('express')
  , app     = express()
  , server  = require('http').createServer(app)
  , io      = require('socket.io').listen(server)
  , util    = require('util')
  , twitter = require('twitter')
  , search  = ""
  , t       = new twitter({
    consumer_key: 'VdyhoULpWGim402KmkQFUEkNQ',
    consumer_secret: 'ennIezQrxbteRVTE4ScrkA2t70X3o5G7HszOs0lZ1uahyBuZH2',
    access_token_key: '2606164616-4ubLDi2559If7jtJT2qYg0jFdpKlPL5ACCS33Gz',
    access_token_secret: 'ROGpwwJ3zB5sRezh42kVaa5xvWfsNgOEBh9nhrfGVehod'
  });

// Welcome message
server.listen(3000);
console.log("Node server started. Listening on port: 3000")

// Public folder
app.use('/public', express.static(__dirname + '/public'));

// Routes
app.get('/', function(req,res) {
  res.sendfile(__dirname + '/index.html')
  search = req.query || ""
});

// Twitter streaming
io.sockets.on('connection', function() {
  io.sockets.emit('new message', "WELCOME!")
  if (search == "") {
    t.stream('statuses/sample', function(stream) {
      stream.on('data', function(data){
        if (data.id != null) {
          io.sockets.emit('new message', data);
        }
      });
    });
  } else {
    t.stream('filter', { track: search.query }, function(stream) {
      stream.on('data', function(data){
        if (data.id != null) {
          io.sockets.emit('new message', data);
        }
      });
    });
  }
});