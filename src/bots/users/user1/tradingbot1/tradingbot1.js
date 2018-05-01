// Use the api to call the functions as specified in the API Docs.
const api = require('../../../../backend/api/api');

/*
 * Our support code operates by calling this trade function every time there are new prices.
 * See the API Docs for more details on the 'prices' object and how you can interact with the API 
 * to accomplish your desired trade behaviors. 
*/
function trade(prices) {
    console.log('trading', prices);
    console.log(api.placeOrder('limit', 'sell', 2, 2, 'BTC', false));
}

/*
 * This is necessary for the support code call your trading bot properly.
*/
module.exports = {
    api,
    trade
};