var keys = {
	  	consumer_key: 'gylXWAs8XXReZXN6uqyfJjY9R',
		consumer_secret: '9KopFkO5GuicJ5fylaVLdiK7jY67Z2SEQjQ7Eqz2OG7kJvNSwv',
		access_token_key: '4259570714-0VBchAWCiA6rck6Z60Nyxr0sR3z6TP3xGJldJHh',
		access_token_secret: 'HVvcoEkXxEQSYufiK0a3trQ9rzmHzjKzaBj64aRPRPNYF'
   	}
	Twitter = require('twitter'),
    clientListener = new Twitter(keys),
    client = new Twitter(keys),
    tweets = [];

clientListener.stream('statuses/filter', {track: '#askswitchfly'}, function(stream) {
	console.log('Listening for Tweets...');
	stream.on('data', function(tweet) {
		if(tweet) {
			tweets.push({
				id: tweet.id_str,
				username: tweet.user.screen_name,
				text: tweet.text,
				hasBeenReplied: false
			});
		}
		stream.destroy();   
	});    
	
	stream.on('error', function(error) {
		console.log(error);
	    throw error;
	});
});

setInterval(shouldPostTweets, 2000);

function shouldPostTweets() {
	if(tweets.filter(needsToBeReplied).length){
		for(var i = 0, len = tweets.length; i < len; i++) {
			if(!tweets[i].hasBeenReplied) {
				console.log('trying to post');
				client.post('statuses/update', { status: '@'+ tweets[i].username  + 'Rooms start at $95/night' , in_reply_to_status_id:tweets[i].id }, function (err, tweet, res) {			});
				tweets[i].hasBeenReplied = true;
				console.log(tweets);
			}
		}
	}
}

function needsToBeReplied(tweet) {
	return !tweet.hasBeenReplied;
}

