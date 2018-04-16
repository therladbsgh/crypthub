const { Router } = require('express');
const GameController = require('../controllers/game.controller');

const router = new Router();

/**
 * Validates information before creating game
 *
 * @param  name - The name of the game
 *
 * @return User object
 */
router.route('/validate').post(GameController.validate);

/**
 * Create new user
 *
 * @param  name - The name of the game
 * @param  description - The game desc
 * @param  start - Start date of game
 * @param  end - End date of game
 * @param  playerPortfolioPublic - Whether players can see
 *                                 each other's portfolios
 * @param  startingBalance - Starting balance of game
 * @param  commissionValue - Commission value when trading
 * @param  shortSelling - Whether to allow short selling
 * @param  limitOrders - Whether to limit orders
 * @param  stopOrders - Whether to allow stop orders
 * @param  isPrivate - Whether the game is private
 * @param  password - Password. Set to empty string if public
 *
 * @return User object
 */
router.route('/create').post(GameController.create);

module.exports = router;