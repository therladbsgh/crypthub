const { Types } = require('mongoose');

const Game = require('../models/game.model');
const Player = require('../models/player.model');
const Coin = require('../models/coin.model');
const Asset = require('../models/asset.model');


/**
 * Validates information before creating game
 *
 * @param  req.body.name - The name of the game
 *
 * @return User object
 */
function validate(req, res) {
  const { id } = req.body;

  Game.findOne({ gameid: id }, (err, game) => {
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
    name, description, start, end,
    playerPortfolioPublic, startingBalance, commissionValue,
    shortSelling, limitOrders, stopOrders,
    isPrivate, password
  } = req.body;
  const gameid = req.body.id;

  const game = new Game({
    gameid,
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
      name: usdCoin._id,
      amount: startingBalance
    });

    usdAsset.save().then((newAsset) => {
      console.log(newAsset);
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
          Game.findOne({ _id: newGame._id })
            .populate({ path: 'players', populate: { path: 'portfolio' } })
            .exec((err2, gameToReturn) => {
              if (err2) res.status(500).json({ err: 'MongoDB query error' });
              res.status(200).json({ data: gameToReturn });
            });
        });
      });
    });
  });
}

function getGame(req, res) {
  const gameid = req.params.id;

  Game.findOne({ gameid }).populate('players').exec((err, game) => {
    if (err) {
      res.status(500).json({ err });
      return;
    }

    let player = {};
    if (req.session.user) {
      game.players.forEach((each) => {
        if (each.username === req.session.user) {
          player = each;
        }
      });
    }

    res.status(200).json({ game, player });
  });
}

function updatePrices(cb) {
  Coin.find({}, (err, coins) => {
    if (err) {
      cb('MongoDB query error');
      return;
    }

    coins.forEach((each) => {
      console.log(each.name);
      // TODO: UPDATE PRICES
    });
    cb(null);
  });
}

function placeOrder(req, res) {
  const {
    type, side, size, price, symbol, date, GTC, filled
  } = req.body;

  console.log(req.body);

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

  });

  if (type === 'market' && side === 'buy') {
    // Regular buy
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
}

module.exports = {
  validate,
  create,
  getGame,
  placeOrder
};
