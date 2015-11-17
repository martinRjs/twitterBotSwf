var twit = require('twitter'),
   twitter = new twit({
consumer_key: 'O3gOvqaH1MkHTxH0lCMEJqnak',
consumer_secret: 'MuPrGIyQ4fGWtnr7ejT5suiWxHB5IKZ52DUP7gwdCnnxRSGW4K',
access_token_key: '2936743710-uZBQ0KPZq8GLowAA8S6dT0lXFZeL3XSTQ2TrqNm',
access_token_secret: 'qA37a8148wvFrwtEKxhpKa2Oo4I9us2uxwP75iDJP3Zy7'
   });

var util = require('util');

twitter.stream('statuses/filter', {track: '#askswitchfly'}, function(stream) {
console.log('Listening for Tweets...');
stream.on('data', function(tweet){
//console.log(util.inspect(tweet));
	console.log(tweet.id_str);
	twitter.post('statuses/update', { status: '@'+ tweet.user.screen_name  + 'Rooms start at $95/night', in_reply_to_status_id: 	tweet.	id_str }, function(err, data, response) {
    	console.log(data);
	});
	stream.destroy();
         process.exit(0);         
});
stream.on('error', function(error) {
    throw error;
  });
});