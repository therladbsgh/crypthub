const { Router } = require('express');
const GameController = require('../controllers/game.controller');

const router = new Router();

router.route('/create').post(GameController.create);

module.exports = router;
