const Asset = require('../models/asset.model.js');
const Game = require('../models/game.model.js');
const Player = require('../models/player.model.js');
const Trade = require('../models/trade.model.js');
const Coin = require('../models/coin.model.js');
const Bot = require('../models/bot.model.js');

require('../db.js');

function wipeAll() {
  Asset.remove({}, () => {});
  Game.remove({}, () => {});
  Player.remove({}, () => {});
  Trade.remove({}, () => {});
  Coin.remove({}, () => {});
  Bot.remove({}, () => {});
  console.log('Database wiped.');
}
wipeAll();

module.exports = {
  wipeAll
};
