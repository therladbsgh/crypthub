const fs = require('fs');
const util = require('util');
const requireFromString = require('require-from-string');

const api = require('./api.js');
const Bot = require('../models/bot.model');

function runBot(botId, gameId, playerId, prices) {
  const consoleLog = console.log;
  try {
    Bot.findOne({ _id: botId }).exec().then((botModel) => {
      const bot = requireFromString(botModel.data);

      bot.api = api;
      bot.api.setContext(gameId, playerId);

      let log = '';
      console.log = (...messages) => {
        if (log.length === 0) {
          log = messages.join(' ');
        } else {
          log += `\n${messages.join(' ')}`;
        }
      };

      bot.trade(prices);

      botModel.set({ log });
      botModel.save();
    });
  } catch (e) {
    consoleLog(`ERROR: ${e}`);
  }
  console.log = consoleLog;
}

module.exports = {
  runBot
};
