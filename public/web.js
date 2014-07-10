// ALL LOGIC ONLOAD
window.onload = function() {
  var w      = document.body.clientWidth
    , h      = document.body.clientHeight
    , socket = io.connect()
    , tweets = document.getElementById('tweets')
    , filter = document.getElementById('filter')
    , map    = document.getElementById('map');

  var options = {
    center: new google.maps.LatLng(0,1),
    zoom: 3
  }
  var m = new google.maps.Map(map, options);

  socket.on('connect', function() {
    console.log('User connected to tweet stream!');
  })

  socket.on('new message', function(data) {
    if (data.geo && data.place && data.user) {
      var coords = data.geo.coordinates
        , text = data.text
        , user = data.user.name
        , image = data.user.profile_image_url
        , geo = data.geo.coordinates
        , place = "";

      data.place ? place = data.place.name : place = "";

      var tweet = new tweetMarker(m, text, user, image, place, new google.maps.LatLng(coords[0], coords[1]))
      tweet.draw();

    } else {
      console.log("Falsy data?");
    }
  })
}

// HELPERS
function fadeTweet(tweets, tweet, opacity) {
  opacity = opacity || 0;
  if (opacity <= 100) {
    tweet.style.opacity = 1 - opacity/100;
    setTimeout(function() {
      fadeTweet(tweets, tweet, opacity + 1);
    }, 0);
  } else {
    tweet.style.opacity = 0;
    tweets.removeChild(tweet);
  }
}

function tweetMarker(map, text, username, image_url, place_text, geo) {
  this.text = text;
  this.name = username;
  this.image = image_url;
  this.place = place_text;
  this.geo = geo;
  this.setMap(map);
}

tweetMarker.prototype = new google.maps.OverlayView();

tweetMarker.prototype.draw = function() {
  var self = this
    , div  = document.createElement('div');

  div.style.border = '2px solid blue';
  div.style.position = 'absolute';
  div.innerHTML = this.text;

  var panes = this.getPanes();
  var overlay = panes.overlayLayer;
  overlay.appendChild(div);

  setTimeout(function() {
    fadeTweet(overlay, div);
  })

  var point = this.getProjection().fromLatLngToDivPixel(this.geo);

  if (point) {
    div.style.left = point.x + 'px';
    div.style.top = point.y + 'px';
  }

}