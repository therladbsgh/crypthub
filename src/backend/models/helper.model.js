const Asset = require('./asset.model.js');
const Game = require('./game.model.js');
const Player = require('./player.model.js');
const Trade = require('./trade.model.js');
const Coin = require('./coin.model.js');

require('../db.js');

function wipeAll() {
  Asset.remove({}, () => {});
  Game.remove({}, () => {});
  Player.remove({}, () => {});
  Trade.remove({}, () => {});
  Coin.remove({}, () => {});
  console.log('Database wiped.');
}
wipeAll();

module.exports = {
  wipeAll
};
