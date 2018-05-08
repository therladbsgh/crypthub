const _ = require('lodash');
const request = require('request');

const backend = 'http://ec2-34-229-105-203.compute-1.amazonaws.com:5000';

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

    if (type != 'market') {
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
    }

    if (!_.includes(['BTC', 'ETH'], coin)) {
      err(reject, `placeOrder: Fifth argument (coin) must be one of 'BTC' or 'ETH'. Found: ${coin}`);
    }

    if (type != 'market') {
      if (!_.isBoolean(GTC)) {
        err(reject, `placeOrder: Sixth argument (GTC) must be a boolean. Found: ${GTC}`);
      }
    }

    const postData = {
      type,
      side,
      size,
      price,
      symbol: coin,
      date: Date.now(),
      GTC,
      filled: false,
      gameId: context.gameId,
      playerId: context.playerId
    };

    const options = {
      method: 'post',
      body: postData,
      json: true,
      url: `${backend}/game/placeorder`
    };

    request.post(options, (error, response, body) => {
      if (error) {
        err(reject, error);
      } else if (body.err) {
        err(reject, body.err);
      } else {
        resolve(body.game._id);
      }
    });
  });
}

function cancelOrder(orderId) {
  return new Promise((resolve, reject) => {
    if (!_.isString(orderId)) {
      err(reject, `cancelOrder: First argument (orderId) must be a string. Found: ${orderId}`);
    }

    const postData = {
      tradeId: orderId,
      gameId: context.gameId,
      playerId: context.playerId
    };

    const options = {
      method: 'post',
      body: postData,
      json: true,
      url: `${backend}/game/cancelorder`
    };

    request.post(options, (error, response, body) => {
      if (error) {
        err(reject, error);
      } else if (body.err) {
        err(reject, body.err);
      } else {
        resolve(body.game._id);
      }
    });
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

function getCurrentOrders() {
  return new Promise((resolve, reject) => {
    request.get(`${backend}/player/getcurrent/${context.playerId}`, (error, response, body) => {
      if (error) {
        err(reject, error);
      } else if (body.err) {
        err(reject, body.err);
      } else {
        const jsonBody = JSON.parse(body);
        resolve(jsonBody);
      }
    });
  });
}

function getCompletedOrders() {
  return new Promise((resolve, reject) => {
    request.get(`${backend}/player/getcompleted/${context.playerId}`, (error, response, body) => {
      if (error) {
        err(reject, error);
      } else if (body.err) {
        err(reject, body.err);
      } else {
        const jsonBody = JSON.parse(body);
        resolve(jsonBody);
      }
    });
  });
}

function getPortfolio() {
  return new Promise((resolve, reject) => {
    request.get(`${backend}/player/getportfolio/${context.playerId}`, (error, response, body) => {
      if (error) {
        err(reject, error);
      } else if (body.err) {
        err(reject, body.err);
      } else {
        const jsonBody = JSON.parse(body);
        resolve(jsonBody);
      }
    });
  });
}

// getHistory() function?

module.exports = {
  setContext,
  placeOrder,
  cancelOrder,
  getOrder,
  getCurrentOrders,
  getCompletedOrders,
  getPortfolio
};
