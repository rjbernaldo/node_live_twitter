// ALL LOGIC ONLOAD
window.onload = function() {
  var w      = document.body.clientWidth
    , h      = document.body.clientHeight
    , socket = io.connect()
    , tweets = document.getElementById('tweets')
    , filter  = document.getElementById('filter');

  socket.on('connect', function() {
    console.log('User connected to tweet stream!');
  })

  socket.on('new message', function(data) {
    // if (data.text.toLowerCase().indexOf(filter.value) >= 0) {
      var tweet_div = createDiv('tweet_tweet')
        , photo_div = createDiv('tweet_photo')
        , text_div = createDiv('tweet_text')
        , main_div = createDiv('tweet_main');

      if (data.user != undefined) {
        tweet_div.innerHTML = data.text;
        photo_div.style.backgroundImage = "url(" + data.user.profile_image_url + ")";
        text_div.innerHTML = data.user.name;
      }

      main_div.style.left = Math.floor(Math.random(w) * 1000);
      main_div.style.top = Math.floor(Math.random(h/2 ) * 500);

      massAppend(main_div, [tweet_div, text_div, photo_div]);

      tweets.appendChild(main_div);

      setTimeout(function() {
        fadeTweet(tweets, main_div);
      }, 2000);
    // }
  })
}

// HELPERS
function createDiv(className) {
  var div = document.createElement('div');
  div.className = className;
  return div
}

function massAppend(div, arr) {
  arr.forEach(function(elem) {
    div.appendChild(elem);
  })
}

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