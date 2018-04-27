const { Router } = require('express');
const CoinController = require('../controllers/coin.controller');

const router = new Router();

/**
 * Gets all coins.
 *
 * @return All coins except USD
 */
router.route('/getall').get(CoinController.getAllCoin);

module.exports = router;
