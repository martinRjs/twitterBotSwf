var TinyURL = require('tinyurl'),
    shortDeepLinkUrl = "";

    TinyURL.shorten('https://plg01.v155test.switchfly.com/travel/arc_waiting.cfm?nav=unitedmp&tab=r&air_room_car_radio=room&area2=|airport:MCO&date1=02/15/16&date2=02/18/16&num_rooms=1&room_info={"rooms":[{"childAges":[],"numAdults":2,"numSeniors":0,"numInfantsInSeats":0,"numInfantsInLaps":0}]}&submit=Submit', function(res) {
    console.log(res);  
});