const axios = require('axios');

const Bot = require('../models/bot.model');
const Player = require('../models/player.model');

const URL = 'http://ec2-52-205-237-224.compute-1.amazonaws.com:8080/compile';

function runBot(botId, gameId, playerId, prices) {
  console.log("SENDING");
  return Bot.findOne({ _id: botId }).exec().then((botModel) => {
    const code = botModel.data;

    return Player.findOne({ _id: playerId }).exec().then((player) => {
      let log = player.activeBotLog;
      console.log(log);

      const params = {
        language: 4,
        code,
        stdin: JSON.stringify(prices),
        additional: `${gameId}*${playerId}`
      };

      return axios.post(URL, params).then((res) => {
        const { status, data } = res;
        const { output, errors } = data;

        if (status === 200) {
          if (output.length > 0) {
            log += `${output.trim()}\n`;
          }

          if (errors.length > 0) {
            log += `ERROR: ${errors.trim()}\n`;
          }
        } else {
          log += 'An unknown error has occurred. This probably is not ' +
                 'due to your trading bot - try again later.\n';
        }

        player.set({ activeBotLog: log });
        return player.save();
      }).catch((e) => {
        console.log(e.message);
        log += 'An unknown error has occurred. This probably is not ' +
               'due to your trading bot - try again later.\n';
        player.set({ activeBotLog: log });
        return player.save();
      });
    });
  }).catch((err) => {
    console.log(err.message);
  });
}

module.exports = {
  runBot
};
