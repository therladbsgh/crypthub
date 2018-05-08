const { Router } = require('express');
const GameController = require('../controllers/game.controller');
const PlayerController = require('../controllers/player.controller');

const router = new Router();

router.route('/placeorder').post(GameController.placeOrder);

router.route('/cancelorder').post(GameController.cancelOrder);

router.route('/getcurrent/:id').get(PlayerController.getCurrent);

router.route('/getcompleted/:id').get(PlayerController.getCompleted);

router.route('/getportfolio/:id').get(PlayerController.getPortfolio);

module.exports = router;
