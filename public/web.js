var overlay
  , collection = []
  , global     = {
    tweet_counter: 0,
    tag_counter: 0,
    trending_words: []
  };

window.onload = function() {
  var w      = document.body.clientWidth
    , h      = document.body.clientHeight
    , socket = io.connect()
    , tweets = document.getElementById('tweets')
    , filter = document.getElementById('filter')
    , map    = document.getElementById('map');

  var options = {
    center: new google.maps.LatLng(50,10),
    zoom: 2,
    panControl: false,
    zoomControl: false,
    scaleControl: false,
    mapTypeControl: false,
    rotateControl: false,
    overviewMapControl: false,
    styles: [
      {
        "stylers": [
          { "saturation": -100 },
          { "gamma": 0.15 },
          { "weight": 1.1 },
          { "lightness": -35 },
          { "visibility": "simplified" }
        ]
      }
    ]

  }

  M = new google.maps.Map(map, options);

  var allClients = [];

  socket.on('connection', function(socket) {
    allClients.push(socket);
    console.log('User connected to tweet stream!');
  })
  socket.on('new message', projectAlgorithim);
}

// Experimental
function projectAlgorithim(data) {
  var nav = document.getElementById('nav');
  global.tweet_counter++;
  var tags = [];
  var temp = collection.slice();
  temp.sort(compare).slice(temp.length - 5, temp.length).forEach(function(o) {
    tags.unshift(o.word);
  });
  nav.innerHTML = "TWEETS: " + global.tweet_counter + "<br>HASHTAGS: " + global.tag_counter + "<br>TOP TAGS: " + tags.join(", ");

  function compare(a,b) {
    if (a.state.level < b.state.level) {
      return -1;
    }
    if (a.state.level > b.state.level) {
      return 1;
    }
    return 0;
  }

  if (data.geo && data.place && data.user) {
    data.text.split(" ").forEach(function(word) {
      if (word.indexOf("#") >= 0) {
        global.tag_counter++;
        nav.innerHTML = "TWEETS: " + global.tweet_counter + "<br>HASHTAGS: " + global.tag_counter + "<br>TOP TAGS: " + tags.join(", ");
        var index = -1;
        for (var i = 0; i < collection.length; i++) {
          if (collection[i].word.toLowerCase() == word.toLowerCase()) {
            index = i;
          }
        }
        if (index < 0) {
          var w = new WordObj(word, data.geo.coordinates);
          collection.push(w);
        } else {
          var obj = collection[index];
          obj.state.counter = 10;
          obj.state.fontSize += 10;
          obj.state.level += 1;
          obj.loc = data.geo.coordinates;
        }
      }
    });
  } else {
    // console.log("Falsy data?");
  }
}

function WordObj(word, loc) {
  this.word   = word;
  this.loc    = loc;
  this.marker = null;
  this.dom    = createDiv('trend');
  this.state  = {
    counter: 10,
    color: 'black',
    fontSize: 10,
    level: 0
  }
  var self = this;

  function determineColor(level) {
    switch(level) {
      case 0:
      return 'white';
      break;
      case 1:
      return 'white';
      break;
      case 2:
      return 'white';
      break;
      case 3:
      return 'white';
      break;
      default:
      return 'white';
    }
  }

  setInterval(function() {
    self.dom.style.opacity = self.state.counter/10;
    self.dom.style.color = determineColor(self.state.level);
    self.dom.style.fontSize = self.state.fontSize + 'px';
    global.trending_words.push(self.word);
    if (global.trending_words.length > 5) {
      global.trending_words.shift();
    }

    if (self.state.counter == 10 && self.marker == null) {
      self.marker = new trendMarker(M, self.word, self.dom, new google.maps.LatLng(self.loc[0], self.loc[1]));
    } else if (self.state.counter <= 0 && self.marker) {
      self.marker.del();
      self.marker = null;
    }

    if (self.state.counter > 0) {
      setTimeout(function() {
        self.state.counter--;
      }, 1000)
    }

  }, 10);
}

// Custom Google marker
function trendMarker(map, word, dom, loc) {
  this.setMap(map);
  this.word = word;
  this.loc = loc;
  this.dom = dom;
}

trendMarker.prototype = new google.maps.OverlayView();

trendMarker.prototype.del = function() {
  overlay.removeChild(this.dom);
}

trendMarker.prototype.draw = function() {
  var div           = this.dom
    , panes         = this.getPanes()

  if (overlay == null) {
    overlay = panes.overlayLayer;
  }

  div.innerHTML = this.word
  overlay.appendChild(div);

  var point = this.getProjection().fromLatLngToDivPixel(this.loc);

  if (point) {
    div.style.left = point.x - div.clientWidth/2 + 'px' ;
    div.style.top = point.y - div.clientHeight/2 + 'px';
  }
}


// Helpers
function createTweet(data) {
  if (data.geo && data.place && data.user) {
    var coords = data.geo.coordinates
    , text   = data.text
    , user   = data.user.name
    , image  = data.user.profile_image_url
    , geo    = data.geo.coordinates
    , place  = ""
    , tweet;

    data.place ? place = data.place.name : place = "";

    tweet = new tweetMarker(M, text, user, image, place, new google.maps.LatLng(coords[0], coords[1]))

  } else {
    console.log("Falsy data?");
  }
}

function createDiv(c) {
  var div = document.createElement('div');
  div.className = c;
  return div
}
