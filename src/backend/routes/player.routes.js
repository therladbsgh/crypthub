const { Router } = require('express');
const PlayerController = require('../controllers/player.controller');

const router = new Router();

router.route('/get/:id').get(PlayerController.getPlayer);
router.route('/getportfolio/:id').get(PlayerController.getPortfolio);

module.exports = router;
