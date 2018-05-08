const Player = require('../models/player.model');

function getPlayer(req, res) {
  const playerId = req.params.id;
  const populatePath = {
    path: 'portfolio transactionHistory transactionCurrent',
    populate: { path: 'coin symbol' }
  };
  Player.findOne({ _id: playerId }).populate(populatePath).lean().exec().then((player) => {
    res.status(200).json({ player });
  }).catch((err) => {
    res.status(500).json({ err: 'Internal server error', traceback: err.message });
  });
}

function getPortfolio(req, res) {
  const playerId = req.params.id;
  const populatePath = {
    path: 'portfolio transactionHistory transactionCurrent',
    populate: { path: 'coin symbol' }
  };
  Player.findOne({ _id: playerId }).populate(populatePath).lean().exec().then((player) => {
    const portfolio = [];
    player.portfolio.forEach((asset) => {
      const newAsset = {
        name: asset.coin.name,
        symbol: asset.coin.symbol,
        amount: asset.amount
      };
      portfolio.push(newAsset);
    });
    console.log(portfolio);
    res.status(200).json({ data: portfolio });
  }).catch((err) => {
    res.status(500).json({ err: 'Internal server error', traceback: err.message });
  });
}

module.exports = {
  getPlayer,
  getPortfolio
};
