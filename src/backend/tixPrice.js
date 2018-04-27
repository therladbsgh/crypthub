var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Calls an API to get prices
module.exports = tixPrice

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function tixPrice(tix, callback) {
  var endpoint = '/ticker/' + tix + '/';
  var url =  'https://api.coinmarketcap.com/v1';
  httpGetAsync(url+endpoint, callback);
}
