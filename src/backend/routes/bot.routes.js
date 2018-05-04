const { Router } = require('express');

const BotController = require('../controllers/bot.controller');
const SessionController = require('../controllers/session.controller');

const router = new Router();

/**
 * Uploads a new bot.
 *
 * @param  code - The code file
 *
 * @return 200 on success, 500 on server error, 403 if not logged in,
 *         400 if bot with same next exists
 */
router.route('/upload').post(SessionController.authenticate, BotController.upload);

router.route('/new').get(SessionController.authenticate, BotController.create);

router.route('/save').post(SessionController.authenticate, BotController.save);

module.exports = router;
