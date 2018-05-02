const { Router } = require('express');

const BotController = require('../controllers/bot.controller');

const router = new Router();

/**
 * Validates information before creating game
 *
 * @param  name - The name of the game
 *
 * @return User object
 */
router.route('/upload').post(BotController.upload);

module.exports = router;
