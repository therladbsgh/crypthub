const _ = require('lodash');

const context = {
    gameId: '',
    playerId: '',
    set: false
};

function setContext(gameId, playerId) {
    if (context.set) {
        throw { message: 'setContext: Illegal call of setContext.' };
    }

    context.gameId = gameId;
    context.playerId = playerId;
    context.set = true;
}

function err(reject, message) {
    reject({ message });
}

function placeOrder(type, side, size, price, coin, GTC) {
    return new Promise((resolve, reject) => {
        if (!_.includes(['market', 'limit', 'stop'], type)) {
            err(reject, `placeOrder: First argument (type) must be one of 'market', 'limit', or 'stop'. Found: ${type}`);
        }

        if (!_.includes(['buy', 'sell'], side)) {
            err(reject, `placeOrder: Second argument (side) must be one of 'buy' or 'sell'. Found: ${side}`);
        }

        if (!_.isNumber(size)) {
            err(reject, `placeOrder: Third argument (size) must be a number. Found: ${size}`);        
        }

        if (size <= 0) {
            err(reject, `placeOrder: Third argument (size) must be greater than 0. Found: ${size}`);  
        }

        const numPlacesSize = Number(size.toString().split('e-')[1]);
        if (numPlacesSize && numPlacesSize > 8) {
            err(reject, `placeOrder: Third argument (size) must have no more than 8 decimal places. Found: ${size}`);          
        }

        if (!_.isNumber(price)) {
            err(reject, `placeOrder: Fourth argument (price) must be a number. Found: ${price}`);
        }

        if (price <= 0) {
            err(reject, `placeOrder: Fourth argument (price) must be greater than 0. Found: ${price}`);  
        }

        const numPlacesPriceE = Number(price.toString().split('e-')[1]);
        const decimal = price.toString().split('.')[1];
        if (numPlacesPriceE ? numPlacesPriceE > 2 : decimal && decimal.length > 2) {
            err(reject, `placeOrder: Fourth argument (price) must have no more than 2 decimal places. Found: ${price}`);          
        }

        if (!_.includes(['BTC', 'ETH'], coin)) {
            err(reject, `placeOrder: Fifth argument (coin) must be one of 'BTC' or 'ETH'. Found: ${coin}`);        
        }

        if (!_.isBoolean(GTC)) {
            err(reject, `placeOrder: Sixth argument (GTC) must be a boolean. Found: ${GTC}`);        
        }

        resolve('id');
    });
}

function cancelOrder(orderId) {
    return new Promise((resolve, reject) => {
        if (!_.isString(orderId)) {
            err(reject, `cancelOrder: First argument (orderId) must be a string. Found: ${orderId}`);        
        }

        resolve(true);
    });
}

function cancelAll() {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}

function getOrder(orderId) {
    return new Promise((resolve, reject) => {
        if (!_.isString(orderId)) {
            err(`getOrder: First argument (orderId) must be a string. Found: ${orderId}`);        
        }

        resolve({ orderId: 'orderid' });
    });
}

function getOrders() {
    return new Promise((resolve, reject) => {
        resolve([{ orderId: 'orderid1' }, { orderId: 'orderid2' }]);
    });
}

function getCompletedOrders() {
    return new Promise((resolve, reject) => {
        resolve([{ orderId: 'orderid1' }, { orderId: 'orderid2' }]);
    });
}

function getPortfolio() {
    return new Promise((resolve, reject) => {
        resolve([{ symbol: 'USD', amount: 100 }, { symbol: 'BTC', amount: 2.003508 }]);
    });
}

// getHistory() function?

module.exports = {
    setContext,
    placeOrder,
    cancelOrder,
    cancelAll,
    getOrder,
    getOrders,
    getCompletedOrders,
    getPortfolio
};