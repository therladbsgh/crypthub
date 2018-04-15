const { Types } = require('mongoose');

const Game = require('../models/game.model');
const Player = require('../models/player.model');


/**
 * Validates information before creating game
 *
 * @param  req.body.name - The name of the game
 *
 * @return User object
 */
function validate(req, res) {
  const { name } = req.body;

  Game.findOne({ name }, (err, game) => {
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

  const game = new Game({
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

  const player = new Player({
    _id: new Types.ObjectId(),
    username: req.session.user,
    netWorth: startingBalance,
    numTrades: 0,
    netReturn: 0,
    todayReturn: 0,
    currRank: 1,
    buyingPower: startingBalance,
    shortReserve: 0
  });

  player.save().then((newPlayer) => {
    game.players = [newPlayer._id];
    game.save().then((newGame) => {
      newGame.populate('Player').then((gameToReturn) => {
        res.json({ data: gameToReturn });
      });
    });
  });
}

module.exports = {
  validate,
  create
};
