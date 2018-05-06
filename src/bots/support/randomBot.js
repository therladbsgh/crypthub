// Use the api to call the functions as specified in the API Docs.
let api;

// We support usage of some node modules such as lodash
const _ = require('lodash');

// The minimum amount of coin you can trade
const minSize = 0.00000001;

/*
 * Our support code operates by calling this trade function every time there are new prices.
 * The 'prices' object is an array of prices for all of the different cryptocurrencies that
 * CryptHub supports, for a given moment in time. See the API Docs for details how you can
 * interact with the API to accomplish your desired trade behaviors.
 * 
 * This trading bot buys a random amount of each coin listed in the prices array, then it 
 * sells a random amount of each of its assets.
*/
function trade(prices) {
    // Get your portfolio (an array of all your assets, including your cash asset)
    api.getPortfolio()
    .then(portfolio => {
        // Find the amount of cash you have
        let cash = _.find(portfolio, { symbol: 'USD' }).amount;

        // For each coin in the prices array, buy a random amount that you can afford
        _.forEach(prices, coin => {
            const { symbol, currPrice } = coin;
            const lowerBound = minSize;
            if (cash >= lowerBound * currPrice) {
                const upperBound = cash / currPrice;
                const size = _.round(_.random(lowerBound, upperBound), 8);
                api.placeOrder('market', 'buy', size, currPrice, symbol, true);
                cash = _.round(cash - size * currPrice, 2);
            }
        });

        // For each of your non-cash assets, sell a random amount
        _.forEach(_.filter(portfolio, asset => asset.symbol != 'USD'), asset => {
            const { symbol, amount } = asset;
            const size = _.round(_.random(minSize, amount), 8);
            api.placeOrder('market', 'sell', size, currPrice, symbol, true);
        });
    });
}

// This is necessary for the support code call your trade function properly.
module.exports = {
    api,
    trade
};
