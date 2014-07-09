jQuery(function($) {
  var w      = document.body.clientWidth
    , h      = document.body.clientHeight
    , socket = io.connect();

  socket.on('new message', function(data) {
    var photo_div = document.createElement('section');
    photo_div.className = "tweet_photo";

    var text_div = document.createElement('section');
    text_div.className = "tweet_text";

    if (data.user != undefined) {
      photo_div.style.backgroundImage = "url(" + data.user.profile_image_url + ")";
      text_div.innerHTML = data.user.name + "<br>" + data.text;
    }

    var main_div = document.createElement('div');
    main_div.className = "tweet_main";
    main_div.style.left = Math.floor(Math.random(w) * 1000);
    main_div.style.top = Math.floor(Math.random(h) * 1000);
    main_div.appendChild(text_div);
    main_div.appendChild(photo_div);

    $('#tweets').append(main_div);
    setTimeout(function() {
      // fadeTweet(main_div);
    }, Math.floor(Math.random() * 10000));

    function fadeTweet(tweet, opacity) {
      opacity = opacity || 0;
      if (opacity <= 100) {
        tweet.style.opacity = 1 - opacity/100;
        setTimeout(function() {
          fadeTweet(tweet, opacity + 5);
        }, 0);
      }
    }

  })
})