// Use the api to call the functions as specified in the API Docs.
const api = require('../../../../backend/api/api');

/*
 * Our support code operates by calling this trade function every time there are new prices.
 * See the API Docs for more details on the 'prices' object and how you can interact with the API 
 * to accomplish your desired trade behaviors. 
*/
function trade(prices) {
    // Perform trade behavior based on the given prices.
}

// This is necessary for the support code call your trade function properly.
module.exports = {
    api,
    trade
};