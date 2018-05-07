const fs = require('fs');
const util = require('util');
const requireFromString = require('require-from-string');

const api = require('./api.js');
const Bot = require('../models/bot.model');
const Player = require('../models/player.model');

function parseLog(messages) {
  const strings = [];
  messages.forEach((message) => {
    if (typeof message === 'object') {
      strings.push(JSON.stringify(message));
    } else {
      strings.push(message);
    }
  });
  return strings;
}

function runBot(botId, gameId, playerId, prices) {
  const consoleLog = console.log;
  Bot.findOne({ _id: botId }).exec().then((botModel) => {
    const bot = requireFromString(botModel.data);
    bot.api = api;
    bot.api.clearContext();
    bot.api.setContext(gameId, playerId);

    Player.findOne({ _id: playerId }).exec().then((player) => {
      let log = player.activeBotLog;

      console.log = (...messageList) => {
        const messages = parseLog(messageList);
        if (log.length === 0) {
          log = messages.join(' ');
        } else {
          log += `\n${messages.join(' ')}`;
        }
      };

      try {
        bot.trade(prices);
      } catch (e) {
        console.log(`ERROR: ${e}`);
      }
      player.set({ activeBotLog: log });
      player.save();
    });
  }).catch((err) => {
    consoleLog(err.message);
  });
  console.log = consoleLog;
}

module.exports = {
  runBot
};
