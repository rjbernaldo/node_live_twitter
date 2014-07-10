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

  M = new google.maps.Map(map, options);

  socket.on('connect', function() {
    console.log('User connected to tweet stream!');
  })

  socket.on('new message', createTweet);
}

// Helpers
function createDiv(c) {
  var div = document.createElement('div');
  div.className = c;
  return div
}

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

// Custom Google marker
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
  var main_div  = createDiv('main')
    , photo_div = createDiv('photo')
    , text_div  = createDiv('text')
    , panes     = this.getPanes()
    , overlay   = panes.overlayLayer;

  photo_div.innerHTML = this.name;
  photo_div.style.backgroundImage = 'url(' + this.image + ')';

  text_div.innerHTML = this.text;

  main_div.appendChild(photo_div);
  main_div.appendChild(text_div);

  overlay.appendChild(main_div);

  setTimeout(function() {
    overlay.removeChild(main_div);
  }, 2500)

  var point = this.getProjection().fromLatLngToDivPixel(this.geo);

  if (point) {
    main_div.style.left = point.x + 'px';
    main_div.style.top = point.y + 'px';
  }
}