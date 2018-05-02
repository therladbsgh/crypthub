const fs = require('fs');
const util = require('util');

function runBot(botPath, logPath, gameId, playerId, prices) {
    const consoleLog = console.log;    
    try {
        const bot = require(botPath);
        bot.api.setContext(gameId, playerId);

        const logFile = fs.createWriteStream(logPath, { flags: 'a' });
        console.log = (...messages) => logFile.write(util.format.apply(null, messages) + '\n');

        bot.trade(prices);
    } catch (e) {
        console.log('[ERROR]', e.message);
    }

    console.log = consoleLog;
}

runBot('../../bots/users/user1/tradingbot1/tradingbot1.js', '../../bots/users/user1/tradingbot1/log.txt', 'gameid', 'playerid', [2, 3, 4]);

module.exports = {
    runBot
};