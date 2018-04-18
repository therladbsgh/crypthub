// Responds to API calls
module.exports = api

function api(request, response) {
  console.log('success');
  console.log(request.body);      // your JSON
  
  var reply = '';
  
  if (request.body.MyKey == 'buy') {
    console.log('buying stuff');
    //call buy handler
    reply = 'bought stuff\n';
  } else if (request.body.MyKey == 'sell') {
    console.log('selling stuff');
    //call sell handler
    reply = 'sold stuff\n';
  } else if (request.body.MyKey == 'get info') {
    console.log('informing stuff');
    //send user what stocks they own
    reply = 'informed you\n';
  } 

  response.send(reply);    // send user a response
}

