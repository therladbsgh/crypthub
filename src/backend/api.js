// Responds to API calls
module.exports = api
var tixPrice = require('./tixPrice');

// Requests have the following things
// 'uid'
// 'action'
// 'ticker'
// optional 'testing'

function api(request, response) {
  console.log('success');
  console.log(request.body);      // your JSON
  
  var reply = '';

  if (request.body.testing != undefined){
    console.log("We are in test mode.  We should be behaving differently.");
    response.send("test recieved\n");
    return;
  }
	
  // get user from request.body.uid
  
  if (request.body.action == 'buy') {
    console.log('buying stuff');
    //call buy handler
    reply = 'bought stuff\n';
  } else if (request.body.action == 'sell') {
    console.log('selling stuff');
    //call sell handler
    reply = 'sold stuff\n';
  } else if (request.body.action == 'get info') {
    console.log('informing stuff');
    //send user what stocks they own
    tixPrice(request.body.ticker, function() { console.log("Hello") } );
    reply = 'informed you\n';
  } 

  response.send(reply);    // send user a response
}

