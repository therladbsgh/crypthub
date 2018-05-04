const Coin = require('../models/coin.model');

function getAllCoin(req, res) {
  Coin.find({ symbol: { $ne: 'USD' }}).exec().then((coins) => {
    res.status(200).json({ data: coins });
  });
}

module.exports = {
  getAllCoin
};
