var keys = {
	  	consumer_key: 'gylXWAs8XXReZXN6uqyfJjY9R',
		consumer_secret: '9KopFkO5GuicJ5fylaVLdiK7jY67Z2SEQjQ7Eqz2OG7kJvNSwv',
		access_token_key: '4259570714-0VBchAWCiA6rck6Z60Nyxr0sR3z6TP3xGJldJHh',
		access_token_secret: 'HVvcoEkXxEQSYufiK0a3trQ9rzmHzjKzaBj64aRPRPNYF'
   	}
	Twitter = require('twitter'),
    clientListener = new Twitter(keys),
    client = new Twitter(keys),
    requestify = require('requestify');
    tweets = [{
    	id: '123',
 		username: 'raquel',
 		text: 'hotel near HNL on 12-21-15 2 Nights',
 		hasBeenReplied: false
    }];

// clientListener.stream('statuses/filter', {track: '#askswitchfly'}, function(stream) {
// 	console.log('Listening for Tweets...');
// 	stream.on('data', function(tweet) {
// 		if(tweet) {
// 			tweets.push({
// 				id: tweet.id_str,
// 				username: tweet.user.screen_name,
// 				text: tweet.text,
// 				hasBeenReplied: false
// 			});
// 		}
// 		stream.destroy();   
// 	});    
	
// 	stream.on('error', function(error) {
// 		console.log(error);
// 	    throw error;
// 	});
// });

setInterval(shouldPostTweets, 2000);

function shouldPostTweets() {
	if(tweets.filter(needsToBeReplied).length){
		for(var i = 0, len = tweets.length; i < len; i++) {
			if(!tweets[i].hasBeenReplied) {
				console.log('trying to post');
				// client.post('statuses/update', { status: '@'+ tweets[i].username  + 'Rooms start at $95/night' , in_reply_to_status_id:tweets[i].id }, function (err, tweet, res) {			});
				tweets[i].hasBeenReplied = true;
				console.log(tweets);
				getHotelResults(parseTweet(tweets[i].text));
			}
		}
	}
}

function needsToBeReplied(tweet) {
	return !tweet.hasBeenReplied;
}

function parseTweet(text) {
 //example format [ hotel near {AirportCode} on {startDate} [number] Nights ] 
 var newArray = text.split(' ');

 return {
 	 	airportCode: newArray[2],
 	 	startDate: newArray[4],
 	 	numberOfNights: newArray[5]
 	 };
}

function getHotelResults(params) {
	var startDate = new Date(params.startDate)
		endDate = new Date(startDate.getTime() + parseInt(params.numberOfNights)*24*60*60*1000);
		
	requestify.get('https://americanexpress.v155test.switchfly.com/apps/api/hotels?exclude=hotelFiltersAmenities,roomAmenities,propertyDescription,rooms&query=%7B%22location%22%3A%22%7Cairport%3A'+ params.airportCode + '%22%2C%22startDate%22%3A' + startDate.getTime() + '%2C%22endDate%22%3A' + endDate.getTime() + '%2C%22firstRoomOccupancy%22%3A%7B%22numAdults%22%3A1%2C%22numChildren%22%3A0%2C%22childAges%22%3A%5B%5D%7D%7D')
	  .then(function(response) {
	      // Get the response body (JSON parsed or jQuery object for XMLs)
	      var responseBody = response.getBody();
	      var hotels = responseBody.data.hotels;
	      console.log(hotels[0].nightlyMinPrice.cashValueInCustomerCurrency);
	      //set initial room 
      	  var cheapestRoom = hotels[0].nightlyMinPrice.cashValueInCustomerCurrency;
      	  //console.log(hotels);
	      for (var hotel in hotels) {
	      	if (hotels.hasOwnProperty(hotel)) {
	       		var currentHotelRoomPrice = hotels[hotel].nightlyMinPrice.cashValueInCustomerCurrency;
	       		if(currentHotelRoomPrice<=cheapestRoom) {
	       			cheapestRoom=currentHotelRoomPrice;
	       		}
	        	// console.log(hotels[hotel].nightlyMinPrice.cashValueInCustomerCurrency);
	       	}
	      }
      
      	console.log('Rooms start at $' + cheapestRoom + '/night');
	  
	  }).fail(function(error){
	  	console.log(error);
	  	console.log('fail');
	  });
	console.log('finish'); 
}














