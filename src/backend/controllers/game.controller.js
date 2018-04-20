const { Types } = require('mongoose');
const axios = require("axios");

const Game = require('../models/game.model');
const Player = require('../models/player.model');
const Coin = require('../models/coin.model');
const Asset = require('../models/asset.model');
const User = require('../models/user.model');
const Trade = require('../models/trade.model');


/**
 * Validates information before creating game
 *
 * @param  req.body.name - The name of the game
 *
 * @return User object
 */
function validate(req, res) {
  const { id } = req.body;

  Game.findOne({ id }, (err, game) => {
    if (err) {
      res.status(500).json({ err: 'MongoDB query error' });
      return;
    }

    if (game) {
      res.status(400).json({ err: 'Name already exists' });
      return;
    }

    res.status(200).json({ success: true });
  });
}

/**
 * Create new user
 *
 * @param  req.body.name - The name of the game
 * @param  req.body.description - The game desc
 * @param  req.body.start - Start date of game
 * @param  req.body.end - End date of game
 * @param  req.body.playerPortfolioPublic - Whether players can see
 *                                          each other's portfolios
 * @param  req.body.startingBalance - Starting balance of game
 * @param  req.body.commissionValue - Commission value when trading
 * @param  req.body.shortSelling - Whether to allow short selling
 * @param  req.body.limitOrders - Whether to limit orders
 * @param  req.body.stopOrders - Whether to allow stop orders
 * @param  req.body.isPrivate - Whether the game is private
 * @param  req.body.password - Password. Set to empty string if public
 *
 * @return User object
 */
function create(req, res) {
  const {
    id, name, description, start, end,
    playerPortfolioPublic, startingBalance, commissionValue,
    shortSelling, limitOrders, stopOrders,
    isPrivate, password
  } = req.body;

  const game = new Game({
    id,
    name,
    description,
    host: req.session.user,
    start,
    end,
    playerPortfolioPublic,
    startingBalance,
    commissionValue,
    shortSelling,
    limitOrders,
    stopOrders,
    isPrivate,
    password
  });

  Coin.findOne({ symbol: 'USD' }, (err, usdCoin) => {
    if (err) res.status(500).json({ err: 'MongoDB query error' });

    const usdAsset = new Asset({
      _id: new Types.ObjectId(),
      coin: usdCoin._id,
      amount: startingBalance
    });

    usdAsset.save().then((newAsset) => {
      const player = new Player({
        _id: new Types.ObjectId(),
        username: req.session.user,
        netWorth: startingBalance,
        numTrades: 0,
        netReturn: 0,
        todayReturn: 0,
        currRank: 1,
        buyingPower: startingBalance,
        shortReserve: 0,
        portfolio: [newAsset._id]
      });

      player.save().then((newPlayer) => {
        game.players = [newPlayer._id];
        game.save().then((newGame) => {
          User.findOne({ username: req.session.user }, (err2, user) => {
            user.games.push(newGame._id);
            user.save().then(() => {
              Game.findOne({ _id: newGame._id })
                .populate({ path: 'players', populate: { path: 'portfolio', populate: { path: 'coin' } } })
                .exec((err3, gameToReturn) => {
                  if (err3) res.status(500).json({ err: 'MongoDB query error' });
                  res.status(200).json({ data: gameToReturn });
                });
            });
          });
        });
      });
    });
  });
}

function getGame(req, res) {
  const { id } = req.params;

  Game.findOne({ id })
    .populate({
      path: 'players',
      populate: { path: 'portfolio transactionHistory transactionCurrent', populate: { path: 'coin symbol' } }
    })
    .exec((err, game) => {
      if (err) {
        res.status(500).json({ err });
        return;
      }

      let gameToReturn = {};
      let player = {};

      if (game) {
        gameToReturn = game;
        if (req.session.user) {
          game.players.forEach((each) => {
            if (each.username === req.session.user) {
              player = each;
            }
          });
        }
      }

      res.status(200).json({ game: gameToReturn, player });
    });
}

function updateSinglePrice(li, cb) {
  if (li.length === 0) {
    cb(null);
  } else if (li[0].name !== 'US Dollars') {
    axios.get(`https://api.coinmarketcap.com/v1/ticker/${li[0].name}`).then((res) => {
      const data = res.data[0];

      Coin.findOne({ name: li[0].name }, (err, coin) => {
        if (err) {
          cb('MongoDB query error');
          return;
        }
        coin.set({ currPrice: parseFloat(data.price_usd) });
        coin.set({ todayReturn: parseFloat(data.percent_change_24h) });
        coin.save((err2) => {
          if (err2) {
            cb('MongoDB save error');
            return;
          }
          const newList = li.slice();
          newList.shift(0);
          updateSinglePrice(newList, cb);
        });
      });
    });
  } else {
    const newList = li.slice();
    newList.shift(0);
    updateSinglePrice(newList, cb);
  }
}

function updatePrices(cb) {
  Coin.find({}, (err, coins) => {
    if (err) {
      cb('MongoDB query error');
      return;
    }

    updateSinglePrice(coins, (err2) => {
      cb(err2);
    });
  });
}

function simpleBuy(username, symbol, size, cb) {
  const populatePath = { path: 'portfolio', populate: { path: 'coin' } };
  Player.findOne({ _id: username }).populate(populatePath).exec().then((player) => {
    let usd;
    let sym;
    player.portfolio.forEach((each) => {
      if (each.coin.symbol === 'USD') {
        usd = each;
      }
      if (each.coin.symbol === symbol) {
        sym = each;
      }
    });

    if (!sym) {
      let coinPrice;
      let coinId;
      let assetId;
      const getCoin = Coin.findOne({ symbol }).exec();
      getCoin.then((coin) => {
        if (usd.amount < size * coin.currPrice) {
          return Promise.reject(new Error('Trying to buy more than amount of USD available'));
        }

        coinPrice = coin.currPrice;
        coinId = coin._id;

        const asset = new Asset({
          _id: new Types.ObjectId(),
          coin: coin._id,
          amount: size
        });

        assetId = asset._id;

        return asset.save();
      }).then((newAsset) => {
        return Asset.findOne({ _id: usd._id }).exec();
      }).then((usdAsset) => {
        usdAsset.set({ amount: usdAsset.amount - (size * coinPrice) });
        return usdAsset.save();
      }).then((newUsdAsset) => {
        const trade = new Trade({
          _id: new Types.ObjectId(),
          type: 'market',
          side: 'buy',
          size,
          price: size * coinPrice,
          coin: coinId,
          date: Date.now(),
          GTC: false,
          filled: true
        });
        return trade.save();
      }).then((newTrade) => {
        player.portfolio.push(assetId);
        player.transactionHistory.push(newTrade._id);
        return player.save();
      }).then(() => {
        cb(null);
      }).catch((err) => {
        console.log(err);
        cb(err);
      });
    } else {
      Asset.findOne({ _id: sym._id });
    }

    console.log(player);
    console.log(usd);
    console.log(sym);
  });
}

function placeOrder(req, res) {
  console.log(req.body);
  const {
    type, side, size, symbol, date, GTC, id, playerId
  } = req.body;

  if (!['market', 'short', 'limit'].includes(type) ||
      !['buy', 'sell'].includes(side)) {
    // Wrong arguments
    res.status(400).json({ error: 'Wrong arguments' });
    return;
  }

  updatePrices((err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }

      if (type === 'market' && side === 'buy') {
        // Regular buy
        simpleBuy(playerId, symbol, size, (err, a) => {console.log(err)});
        res.status(200).json({ success: true });
      } else if (type === 'market' && side === 'sell') {
        // Regular sell
      } else if (type === 'short' && side === 'buy') {
        // Short buying
      } else if (type === 'short' && side === 'sell') {
        // Short selling
      } else if (type === 'limit' && side === 'buy') {
        // Limit buying
      } else if (type === 'limit' && side === 'sell') {
        // Limit selling
      } else {
        // Wrong argument
        res.status(400).json({ error: 'Wrong arguments' });
      }
  });
}

function getAll(req, res) {
  Game.find({}).populate('players').exec().then((games) => {
    res.status(200).json({ games });
  });
}

module.exports = {
  validate,
  create,
  getGame,
  placeOrder,
  getAll
};
