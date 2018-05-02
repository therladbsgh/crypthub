// Use the api to call the functions as specified in the API Docs.
const api = require('../../../../backend/api/api');

/*
 * Our support code operates by calling this trade function every time there are new prices.
 * The 'prices' object is an array of prices for all of the different cryptocurrencies that 
 * CryptHub supports, for a given moment in time. See the API Docs for details how you can 
 * interact with the API to accomplish your desired trade behaviors. 
*/
function trade(prices) {
    // Use console.log to print information you want to see in the debug log
    console.log(prices);

    // Perform trade behavior based on the given prices.
}

// This is necessary for the support code call your trade function properly.
module.exports = {
    api,
    trade
};