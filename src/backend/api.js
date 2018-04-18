// Responds to API calls
module.exports = api

// Requests have the following things
// 'uid'
// 'action'
// 'ticker'

function api(request, response) {
  console.log('success');
  console.log(request.body);      // your JSON
  
  var reply = '';

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
    reply = 'informed you\n';
  } 

  response.send(reply);    // send user a response
}

