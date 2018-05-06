// Use the api to call the functions as specified in the API Docs.
const api = require('./api.js');

// We support usage of some node modules such as lodash
const _ = require('lodash');

// The minimum amount of coin you can trade
const minSize = 0.00000001;

// The prices at which to buy and sell BTC
const low = 9600
const high = 9650

/*
 * Our support code operates by calling this trade function every time there are new prices.
 * The 'prices' object is an array of prices for all of the different cryptocurrencies that
 * CryptHub supports, for a given moment in time. See the API Docs for details how you can
 * interact with the API to accomplish your desired trade behaviors.
 * 
 * This trading bot operates by waiting for the BTC price to go above 'low', at which point it  
 * spends all its cash on a BTC limit buy at the 'low' price. Once this order fills, the bot then 
 * immediately places a BTC limit sell at the 'high' price. Once this order fills, the process 
 * repeats. In this way, the bot constantly buys 'low' and sells 'high'.
*/
function trade(prices) {
    // Get the current BTC price
    const price = _.find(prices, { symbol: 'BTC' }).price;

    // Get your portfolio (an array of all your assets, including your cash asset)
    api.getPortfolio()
    .then(portfolio => {
        console.log('Our portfolio is: ', portfolio);

        // Find the amount of cash and BTC you have
        const cash = _.find(portfolio, { symbol: 'USD' }).amount;
        const btc = _.find(portfolio, { symbol: 'BTC' }).amount;

        // If you can place a valid limit buy at 'low' using all your cash, then do so
        var size = cash / low;
        if (price > low && size >= minSize) {
            size = _.round(size, 8);
            api.placeOrder('limit', 'buy', size, low, 'BTC', true)
            .then(() => {
                console.log(`Limit order to buy ${size} BTC at ${low} has been placed.`);
            });
        } else if (price < high && btc > 0) {
            // Otherwise, if you can place a valid limit sell at 'high' using all your btc, then do so
            api.placeOrder('limit', 'sell', btc, high, 'BTC', true)
            .then(() => {
                console.log(`Limit order to sell ${btc} BTC at ${high} has been placed.`);
            });
        }
    });
}

// This is necessary for the support code call your trade function properly.
module.exports = {
    api,
    trade
};
