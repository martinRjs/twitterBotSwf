var keys = {
	//switchfly credentials 
// 	  	consumer_key: 'O3gOvqaH1MkHTxH0lCMEJqnak',
// 		consumer_secret: '9KopFkO5GuicJ5fylaVLdiK7jY67Z2SEQjQ7Eqz2OG7kJvNSwv',
// 		access_token_key: '4259570714-0VBchAWCiA6rck6Z60Nyxr0sR3z6TP3xGJldJHh',
// 		access_token_secret: 'HVvcoEkXxEQSYufiK0a3trQ9rzmHzjKzaBj64aRPRPNYF'
//ivan credentials
		consumer_key: 'O3gOvqaH1MkHTxH0lCMEJqnak',
		consumer_secret: 'MuPrGIyQ4fGWtnr7ejT5suiWxHB5IKZ52DUP7gwdCnnxRSGW4K',
		access_token_key: '2936743710-uZBQ0KPZq8GLowAA8S6dT0lXFZeL3XSTQ2TrqNm',
		access_token_secret: 'qA37a8148wvFrwtEKxhpKa2Oo4I9us2uxwP75iDJP3Zy7'
   	},
	Twitter = require('twitter'),
    clientListener = new Twitter(keys),
    client = new Twitter(keys),
    requestify = require('requestify');
    tweets = [];

clientListener.stream('statuses/filter', {track: '#askswitchfly'}, function(stream) {
	console.log('Listening for Tweets...');
	stream.on('data', function(tweet) {
		console.log("tweet: " + tweet.text);
		if(tweet) {
			tweets.push({
				id: tweet.id_str,
				username: tweet.user.screen_name,
				text: tweet.text,
				hasBeenReplied: false
			});
		}
	});    
	
	stream.on('error', function(error) {
	    throw error;
	});
});

setInterval(shouldPostTweets, 2000);

function shouldPostTweets() {
	if(tweets.filter(needsToBeReplied).length){
		for(var i = 0, len = tweets.length; i < len; i++) {
			if(!tweets[i].hasBeenReplied) {
				tweets[i].hasBeenReplied = true;
				console.log('searching for hotels . . .');
				getHotelResults(parseTweet(tweets[i].text), i, function(index, cheapestRoom) {
					console.log('trying to reply . . .');
					client.post('statuses/update', { status: '@'+ tweets[index].username  + ' Rooms start at $' + cheapestRoom + '/night' , in_reply_to_status_id:tweets[index].id }, function (err, tweet, res) {		
						console.log('replied to tweet!');
						if(!err) {
							tweets[index].hasBeenReplied = true;
						}
					});					
				});
			}
		}
	}
}

function needsToBeReplied(tweet) {
	return !tweet.hasBeenReplied;
}

function parseTweet(text) {
 //example format [ #askswitchfly hotel near {AirportCode} on {startDate} for [number] Nights ] 
 var newArray = text.split(' ');

 return {
 	 	airportCode: newArray[3],
 	 	startDate: newArray[5],
 	 	numberOfNights: newArray[7]
 	 };
}

function getHotelResults(params, index, callback) {
	var startDate = new Date(params.startDate)
		endDate = new Date(startDate.getTime() + parseInt(params.numberOfNights)*24*60*60*1000);
	
	requestify.get('https://americanexpress.v155test.switchfly.com/apps/api/hotels?exclude=hotelFiltersAmenities,roomAmenities,propertyDescription,rooms&query=%7B%22location%22%3A%22%7Cairport%3A'+ params.airportCode + '%22%2C%22startDate%22%3A' + startDate.getTime() + '%2C%22endDate%22%3A' + endDate.getTime() + '%2C%22firstRoomOccupancy%22%3A%7B%22numAdults%22%3A1%2C%22numChildren%22%3A0%2C%22childAges%22%3A%5B%5D%7D%7D')
	  .then(function(response) {
	    var responseBody = response.getBody(),
	    	hotels = responseBody.data.hotels,
	        cheapestRoom = getCheapestRoom(hotels);
	  		
	  	if(callback !== undefined) {
	  		callback(index, cheapestRoom);
	  	}

	  	return cheapestRoom;
	  }).fail(function(error){
	  	console.log('fail: ' + error);
	  });
}

function getCheapestRoom(hotels) {
	var cheapestRoom = hotels[0].nightlyMinPrice.cashValueInCustomerCurrency;
	      for (var hotel in hotels) {
	      	if (hotels.hasOwnProperty(hotel)) {
	       		var currentHotelRoomPrice = hotels[hotel].nightlyMinPrice.cashValueInCustomerCurrency;
	       		if(currentHotelRoomPrice <= cheapestRoom) {
	       			cheapestRoom=currentHotelRoomPrice;
	       		}
	       	}
	      }

	return cheapestRoom;
}














