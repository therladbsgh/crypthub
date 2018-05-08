// Use the api to call the functions as specified in the API Docs.
const api = require('./api.js');

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
 * This trading bot randomly chooses to either buy or sell. If buy, it buys a random amount 
 * of each coin listed in the prices array. If sell, it sells a random amount of each of its assets.
*/
function trade(prices) {
    // Get your portfolio (an array of all your assets, including your cash asset)
    api.getPortfolio()
    .then(portfolio => {
        console.log('Our portfolio is: ', portfolio);

        // Find the amount of cash you have
        var cash = _.find(portfolio, { symbol: 'USD' }).amount;

        // Randomly choose to either buy or sell
        if (_.random(0, 1, true) > 0.5) {
            // For each coin in the prices array, buy a random amount that you can afford
            _.forEach(prices, coin => {
                const symbol = coin.symbol;
                const price = coin.price;
                const lowerBound = minSize;

                if (cash >= lowerBound * price) {
                    const upperBound = cash / price;
                    const size = _.round(_.random(lowerBound, upperBound), 8);
                    api.placeOrder('market', 'buy', size, price, symbol, true)
                    .then(() => {
                        console.log(`Market order to buy ${size} ${symbol} at ${price} has been executed.`);
                        cash = _.round(cash - size * price, 2);
                    });
                }
            });
        } else {
            // For each of your non-cash assets, sell a random amount
            _.forEach(_.filter(portfolio, asset => asset.symbol != 'USD'), asset => {
                const symbol = asset.symbol;
                const amount = asset.amount;
                const price = asset.currPrice;

                const size = _.round(_.random(minSize, amount), 8);
                api.placeOrder('market', 'sell', size, price, symbol, true)
                .then(() => {
                    console.log(`Market order to sell ${size} ${symbol} at ${price} has been executed.`);
                });
            });
        }
    });
}

// This is necessary for the support code call your trade function properly.
module.exports = {
    api,
    trade
};
