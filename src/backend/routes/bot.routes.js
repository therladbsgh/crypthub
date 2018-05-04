const { Router } = require('express');

const BotController = require('../controllers/bot.controller');
const SessionController = require('../controllers/session.controller');

const router = new Router();

/**
 * Uploads a new bot.
 *
 * @param  code - The code file
 *
 * @return 200 on success, 500 on server error, 403 if not logged in
 */
router.route('/upload').all(SessionController.authenticate).post(BotController.upload);

module.exports = router;
